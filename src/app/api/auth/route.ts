import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminPassword,
  getExpectedToken,
  getGitHubConfig,
  isAdminAuthenticated,
} from "@/lib/admin-auth";

export async function GET() {
  const authenticated = await isAdminAuthenticated();
  const { token } = getGitHubConfig();
  return NextResponse.json({
    ok: true,
    authenticated,
    hasGitHubToken: Boolean(token),
  });
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { password?: string };
    const submitted = (body.password || "").trim();
    const expected = getAdminPassword();

    if (submitted !== expected) {
      return NextResponse.json(
        { ok: false, error: "Invalid studio admin password." },
        { status: 401 }
      );
    }

    const tokenValue = getExpectedToken();
    const { token: ghToken } = getGitHubConfig();
    const response = NextResponse.json({
      ok: true,
      authenticated: true,
      hasGitHubToken: Boolean(ghToken),
    });

    response.cookies.set(ADMIN_COOKIE_NAME, tokenValue, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, authenticated: false });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

