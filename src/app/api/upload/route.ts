import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getGitHubConfig, isAdminAuthenticated } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const authed = await isAdminAuthenticated();
    if (!authed) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized. Please unlock Edit Mode first." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { ok: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename
    const safeName = file.name
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .toLowerCase();
    const fileName = `${Date.now()}-${safeName}`;
    const isVideo = file.type.startsWith("video/");

    const { token, repo, branch } = getGitHubConfig();
    let savedToGitHub = false;
    let savedToLocalDisk = false;

    // 1. Save to GitHub repository if GITHUB_TOKEN is configured (works globally across all devices)
    if (token) {
      const ghApiUrl = `https://api.github.com/repos/${repo}/contents/public/uploads/${fileName}`;
      const ghRes = await fetch(ghApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload media ${fileName}`,
          content: buffer.toString("base64"),
          branch,
        }),
      });

      if (ghRes.ok) {
        savedToGitHub = true;
      }
    }

    // 2. Also write to local disk if writable (for local dev server)
    try {
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(uploadsDir, { recursive: true });
      const filePath = path.join(uploadsDir, fileName);
      await fs.writeFile(filePath, buffer);
      savedToLocalDisk = true;
    } catch {
      // Read-only filesystem in serverless production
    }

    if (!savedToGitHub && !savedToLocalDisk) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Server filesystem is read-only and GITHUB_TOKEN is not configured.",
        },
        { status: 500 }
      );
    }

    // Use /api/media/<fileName> so it resolves immediately from local disk OR GitHub without waiting for a rebuild
    const publicUrl = `/api/media/${fileName}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      isVideo,
      savedToGitHub,
      name: file.name,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
