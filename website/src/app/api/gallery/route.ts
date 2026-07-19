import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

// Public API - fetch active gallery images for the website
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, image_url, caption, category FROM gallery_images WHERE is_active = TRUE ORDER BY display_order ASC, created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Gallery fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
