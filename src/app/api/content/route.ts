import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SiteContent } from "@/data/portfolio";
import { getGitHubConfig, isAdminAuthenticated } from "@/lib/admin-auth";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "site-content.json");
const GH_FILE_PATH = "data/site-content.json";

type StoredContent = SiteContent & { updatedAt?: number };

// Simple in-memory write lock to prevent concurrent file corruption
let writeQueue: Promise<void> = Promise.resolve();

async function fetchFromGitHub(): Promise<{
  content: StoredContent | null;
  sha?: string;
}> {
  const { token, repo, branch } = getGitHubConfig();
  const apiUrl = `https://api.github.com/repos/${repo}/contents/${GH_FILE_PATH}?ref=${branch}`;

  try {
    const headers: Record<string, string> = {
      Accept: "application/vnd.github+json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(apiUrl, {
      headers,
      cache: "no-store",
    });

    if (res.ok) {
      const meta = (await res.json()) as {
        content?: string;
        sha?: string;
        encoding?: string;
      };
      if (meta.content && meta.encoding === "base64") {
        const decoded = Buffer.from(meta.content, "base64").toString("utf-8");
        const parsed = JSON.parse(decoded) as StoredContent;
        if (parsed && Array.isArray(parsed.projects)) {
          return { content: parsed, sha: meta.sha };
        }
      }
    }
  } catch {
    // Fallback to raw URL if unauthenticated API rate-limited
  }

  try {
    const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/${GH_FILE_PATH}?t=${Date.now()}`;
    const rawRes = await fetch(rawUrl, { cache: "no-store" });
    if (rawRes.ok) {
      const parsed = (await rawRes.json()) as StoredContent;
      if (parsed && Array.isArray(parsed.projects)) {
        return { content: parsed };
      }
    }
  } catch {
    // Ignore
  }

  return { content: null };
}

export async function GET() {
  let localContent: StoredContent | null = null;
  let ghContent: StoredContent | null = null;

  // 1. Check local file (if present)
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContents) as StoredContent;
    if (parsed && Array.isArray(parsed.projects)) {
      localContent = parsed;
    }
  } catch {
    // No local file
  }

  // 2. Check GitHub repository for latest global content
  try {
    const ghResult = await fetchFromGitHub();
    ghContent = ghResult.content;
  } catch {
    // Ignore
  }

  // Pick whichever has the newer updatedAt timestamp
  const best =
    localContent && ghContent
      ? (ghContent.updatedAt || 0) >= (localContent.updatedAt || 0)
        ? ghContent
        : localContent
      : ghContent || localContent;

  if (best) {
    return NextResponse.json({
      ok: true,
      hasSavedContent: true,
      content: best,
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
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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
