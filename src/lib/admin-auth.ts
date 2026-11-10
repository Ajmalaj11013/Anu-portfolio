import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_COOKIE_NAME = "ajnas_admin_session";

export function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD || "ajnas2025";
}

export function getExpectedToken(): string {
  const secret = getAdminPassword();
  return crypto
    .createHmac("sha256", "ajnas-portfolio-studio-salt")
    .update(secret)
    .digest("hex");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
    if (!session) return false;
    return session === getExpectedToken();
  } catch {
    return false;
  }
}

export function getGitHubConfig() {
  const token = process.env.GITHUB_TOKEN || "";
  const repo = process.env.GITHUB_REPO || "Ajmalaj11013/Anu-portfolio";
  const branch = process.env.GITHUB_BRANCH || "main";
  return { token, repo, branch };
}
