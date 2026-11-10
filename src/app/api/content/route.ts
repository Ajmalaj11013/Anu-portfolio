import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { getGitHubConfig, isAdminAuthenticated } from "@/lib/admin-auth";
import {
  DATA_DIR,
  DATA_FILE_PATH,
  GH_FILE_PATH,
  StoredContent,
  fetchFromGitHub,
  getLatestServerSiteContent,
} from "@/lib/site-content";

// Simple in-memory write lock to prevent concurrent file corruption
let writeQueue: Promise<void> = Promise.resolve();

export async function GET() {
  const { hasSavedContent, content } = await getLatestServerSiteContent();

  if (hasSavedContent) {
    return NextResponse.json({
      ok: true,
      hasSavedContent: true,
      content,
    });
  }

  return NextResponse.json({ ok: true, hasSavedContent: false });
}

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized. Please unlock Edit Mode first." },
        { status: 401 }
      );
    }

    const body = (await request.json()) as StoredContent;
    const payload: StoredContent = {
      ...body,
      updatedAt: body.updatedAt || Date.now(),
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const { token, repo, branch } = getGitHubConfig();

    let savedToGitHub = false;
    let savedToLocal = false;

    // Serialize writes so rapid edits never conflict on GitHub SHA or local disk
    writeQueue = writeQueue.then(async () => {
      // 1. Save to GitHub if GITHUB_TOKEN is configured
      if (token) {
        try {
          const { sha } = await fetchFromGitHub();
          const apiUrl = `https://api.github.com/repos/${repo}/contents/${GH_FILE_PATH}`;
          const ghRes = await fetch(apiUrl, {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/vnd.github+json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: "Update site content via Studio Editor",
              content: Buffer.from(jsonString, "utf-8").toString("base64"),
              branch,
              ...(sha ? { sha } : {}),
            }),
          });
          if (ghRes.ok) {
            savedToGitHub = true;
          }
        } catch {
          // Ignore GitHub write error
        }
      }

      // 2. Also write to local disk if writable (local dev)
      try {
        await fs.mkdir(DATA_DIR, { recursive: true });
        const tempPath = `${DATA_FILE_PATH}.tmp`;
        await fs.writeFile(tempPath, jsonString, "utf-8");
        await fs.rename(tempPath, DATA_FILE_PATH);
        savedToLocal = true;
      } catch {
        // Read-only filesystem in serverless production
      }
    });

    await writeQueue;

    return NextResponse.json({
      ok: true,
      savedToGitHub,
      savedToLocal,
      content: payload,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { token, repo, branch } = getGitHubConfig();

  if (token) {
    try {
      const { sha } = await fetchFromGitHub();
      if (sha) {
        const apiUrl = `https://api.github.com/repos/${repo}/contents/${GH_FILE_PATH}`;
        await fetch(apiUrl, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Reset site content to defaults",
            sha,
            branch,
          }),
        });
      }
    } catch {
      // Ignore
    }
  }

  try {
    await fs.unlink(DATA_FILE_PATH);
  } catch {
    // Ignore
  }

  return NextResponse.json({ ok: true });
}
