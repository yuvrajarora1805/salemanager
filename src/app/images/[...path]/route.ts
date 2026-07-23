import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const mimeTypes: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".avif": "image/avif",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    
    // Check in website/public/images first, fallback to public/images
    let filePath = path.join(process.cwd(), "website", "public", "images", ...pathSegments);
    
    try {
      await fs.access(filePath);
    } catch {
      filePath = path.join(process.cwd(), "public", "images", ...pathSegments);
    }

    const fileBuffer = await fs.readFile(filePath);
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Image Not Found", { status: 404 });
  }
}
