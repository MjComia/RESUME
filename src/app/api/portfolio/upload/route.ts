import { promises as fs } from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { filename, dataUrl } = (await request.json()) as {
      filename?: string;
      dataUrl?: string;
    };

    if (!dataUrl || !dataUrl.startsWith("data:image/")) {
      return NextResponse.json(
        { error: "Invalid image data URL." },
        { status: 400 }
      );
    }

    const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!match) {
      return NextResponse.json({ url: dataUrl, savedToDisk: false });
    }

    const mimeSubtype = match[1].toLowerCase();
    const base64Payload = match[2];
    const ext =
      mimeSubtype === "svg+xml"
        ? "svg"
        : mimeSubtype === "png"
        ? "png"
        : mimeSubtype === "webp"
        ? "webp"
        : "jpg";

    const cleanBase = (filename || "upload")
      .replace(/\.[^/.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 40);

    const outName = `${Date.now()}-${cleanBase || "asset"}.${ext}`;
    const uploadsDir = path.join(process.cwd(), "public", "images", "uploads");

    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.writeFile(
        path.join(uploadsDir, outName),
        Buffer.from(base64Payload, "base64")
      );
      return NextResponse.json({
        url: `/images/uploads/${outName}`,
        savedToDisk: true,
      });
    } catch {
      // Read-only host fallback: keep compressed data URL directly
      return NextResponse.json({
        url: dataUrl,
        savedToDisk: false,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Could not upload image." },
      { status: 400 }
    );
  }
}

