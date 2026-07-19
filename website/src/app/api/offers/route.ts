import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM offers WHERE is_active = TRUE AND (end_date IS NULL OR end_date >= CURDATE()) ORDER BY created_at DESC"
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Offers fetch error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
