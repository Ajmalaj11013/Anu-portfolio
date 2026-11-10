import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { SiteContent } from "@/data/portfolio";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE_PATH = path.join(DATA_DIR, "site-content.json");

// Simple in-memory write lock to prevent concurrent file corruption
let writeQueue: Promise<void> = Promise.resolve();

export async function GET() {
  try {
    const fileContents = await fs.readFile(DATA_FILE_PATH, "utf-8");
    const parsed = JSON.parse(fileContents) as SiteContent & {
      updatedAt?: number;
    };
    if (parsed && Array.isArray(parsed.projects)) {
      return NextResponse.json({
        ok: true,
        hasSavedContent: true,
        content: parsed,
      });
    }
    return NextResponse.json({ ok: true, hasSavedContent: false });
  } catch {
    // Return hasSavedContent: false so client does NOT overwrite browser-saved edits with defaults
    return NextResponse.json({ ok: true, hasSavedContent: false });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SiteContent & { updatedAt?: number };
    const payload = {
      ...body,
      updatedAt: body.updatedAt || Date.now(),
    };

    const jsonString = JSON.stringify(payload, null, 2);

    writeQueue = writeQueue.then(async () => {
      await fs.mkdir(DATA_DIR, { recursive: true });
      const tempPath = `${DATA_FILE_PATH}.tmp`;
      await fs.writeFile(tempPath, jsonString, "utf-8");
      await fs.rename(tempPath, DATA_FILE_PATH);
    });

    await writeQueue;

    return NextResponse.json({ ok: true, content: payload });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await fs.unlink(DATA_FILE_PATH);
  } catch {
    // Ignore if file already doesn't exist
  }
  return NextResponse.json({ ok: true });
}
