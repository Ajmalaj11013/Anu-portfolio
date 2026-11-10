import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT, SiteContent } from "@/data/portfolio";
import { getGitHubConfig } from "@/lib/admin-auth";

export const DATA_DIR = path.join(process.cwd(), "data");
export const DATA_FILE_PATH = path.join(DATA_DIR, "site-content.json");
export const GH_FILE_PATH = "data/site-content.json";

export type StoredContent = SiteContent & { updatedAt?: number };

export async function fetchFromGitHub(): Promise<{
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

export async function getLatestServerSiteContent(): Promise<{
  hasSavedContent: boolean;
  content: StoredContent;
}> {
  let localContent: StoredContent | null = null;
  let ghContent: StoredContent | null = null;

  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContents) as StoredContent;
    if (parsed && Array.isArray(parsed.projects)) {
      localContent = parsed;
    }
  } catch {
    // No local file
  }

  try {
    const ghResult = await fetchFromGitHub();
    ghContent = ghResult.content;
  } catch {
    // Ignore
  }

  const best =
    localContent && ghContent
      ? (ghContent.updatedAt || 0) >= (localContent.updatedAt || 0)
        ? ghContent
        : localContent
      : ghContent || localContent;

  if (best) {
    return {
      hasSavedContent: true,
      content: best,
    };
  }

  return {
    hasSavedContent: false,
    content: DEFAULT_SITE_CONTENT,
  };
}
