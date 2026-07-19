import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

export const dynamic = 'force-dynamic';

// GET - List all gallery images (public for website, all for admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    let query = "SELECT * FROM gallery_images";
    if (activeOnly) {
      query += " WHERE is_active = TRUE";
    }
    query += " ORDER BY display_order ASC, created_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 });
  }
}

// POST - Add new gallery image (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { image_url, caption, category, display_order } = body;

    if (!image_url) {
      return NextResponse.json({ error: "image_url is required" }, { status: 400 });
    }

    const [result] = await pool.execute(
      "INSERT INTO gallery_images (image_url, caption, category, display_order) VALUES (?, ?, ?, ?)",
      [image_url, caption || "", category || "Station", display_order || 0]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("Gallery insert error:", error);
    return NextResponse.json({ error: "Failed to add gallery image" }, { status: 500 });
  }
}
