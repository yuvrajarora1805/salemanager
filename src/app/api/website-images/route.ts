import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, readdir, stat } from "fs/promises";
import path from "path";

const IMAGES_DIR = path.join(process.cwd(), "website", "public", "images");

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const files = await readdir(IMAGES_DIR);
    const imageFiles = [];

    for (const file of files) {
      const filePath = path.join(IMAGES_DIR, file);
      const fileStat = await stat(filePath);
      
      // Only include files (not directories like "gallery")
      if (fileStat.isFile() && /\.(jpe?g|png|webp|gif|avif)$/i.test(file)) {
        imageFiles.push({
          name: file,
          url: `/images/${file}`,
          size: fileStat.size,
          updatedAt: fileStat.mtime.toISOString(),
        });
      }
    }

    return NextResponse.json({ images: imageFiles });
  } catch (error) {
    console.error("Website images fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const targetFilename = formData.get("targetFilename") as string | null;

    if (!file || !targetFilename) {
      return NextResponse.json({ error: "Missing file or target filename" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large. Max 10MB." }, { status: 400 });
    }

    // Ensure we are replacing an existing file in the directory
    // Prevent directory traversal attacks
    if (targetFilename.includes("/") || targetFilename.includes("\\") || targetFilename === "..") {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = path.join(IMAGES_DIR, targetFilename);
    
    // We overwrite the existing file
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, filename: targetFilename }, { status: 200 });
  } catch (error) {
    console.error("Website images upload error:", error);
    return NextResponse.json({ error: "Failed to replace image" }, { status: 500 });
  }
}
