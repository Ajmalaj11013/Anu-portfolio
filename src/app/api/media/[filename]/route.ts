import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { getGitHubConfig } from "@/lib/admin-auth";

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    case ".gif":
      return "image/gif";
    case ".svg":
      return "image/svg+xml";
    case ".avif":
      return "image/avif";
    case ".mp4":
      return "video/mp4";
    case ".webm":
      return "video/webm";
    case ".mov":
      return "video/quicktime";
    default:
      return "application/octet-stream";
  }
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeName = path.basename(filename);
  const contentType = getMimeType(safeName);

  // 1. Try local filesystem first (fast in local dev or if present in build)
  try {
    const localPath = path.join(process.cwd(), "public", "uploads", safeName);
    const fileBuffer = await fs.readFile(localPath);
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    // Fall through to GitHub raw fetch
  }

  // 2. Fetch directly from GitHub repository so newly uploaded files are live immediately on all devices
  const { token, repo, branch } = getGitHubConfig();
  const rawUrl = `https://raw.githubusercontent.com/${repo}/${branch}/public/uploads/${encodeURIComponent(
    safeName
  )}`;

  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const ghRes = await fetch(rawUrl, {
      headers,
      cache: "no-store",
    });

    if (ghRes.ok) {
      const arrayBuf = await ghRes.arrayBuffer();
      return new NextResponse(arrayBuf, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  } catch {
    // Ignore
  }

  return NextResponse.json({ error: "Media not found" }, { status: 404 });
}

