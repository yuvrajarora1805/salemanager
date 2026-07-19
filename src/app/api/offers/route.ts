import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

// GET - List all offers
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    let query = "SELECT * FROM offers";
    if (activeOnly) {
      query += " WHERE is_active = TRUE AND (end_date IS NULL OR end_date >= CURDATE())";
    }
    query += " ORDER BY created_at DESC";

    const [rows] = await pool.query<RowDataPacket[]>(query);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Offers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}

// POST - Add new offer (admin only)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, image_url, start_date, end_date, is_active } = body;

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    const [result] = await pool.execute(
      "INSERT INTO offers (title, description, image_url, start_date, end_date, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [title, description || "", image_url || "", start_date || null, end_date || null, is_active !== false]
    );

    return NextResponse.json({ success: true, id: (result as any).insertId }, { status: 201 });
  } catch (error) {
    console.error("Offer insert error:", error);
    return NextResponse.json({ error: "Failed to add offer" }, { status: 500 });
  }
}
