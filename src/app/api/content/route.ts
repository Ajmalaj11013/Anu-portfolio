import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { DEFAULT_SITE_CONTENT, SiteContent } from "@/data/portfolio";

const DATA_FILE_PATH = path.join(
  process.cwd(),
  "src",
  "data",
  "site-content.json"
);

export async function GET() {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed: SiteContent = JSON.parse(fileContents);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(DEFAULT_SITE_CONTENT);
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteContent;
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(body, null, 2), "utf-8");
    return NextResponse.json({ ok: true, content: body });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
