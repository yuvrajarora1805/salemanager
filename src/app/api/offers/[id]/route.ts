import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT - Update offer
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, image_url, start_date, end_date, is_active } = body;

    await pool.execute(
      "UPDATE offers SET title = ?, description = ?, image_url = ?, start_date = ?, end_date = ?, is_active = ? WHERE id = ?",
      [title, description || "", image_url || "", start_date || null, end_date || null, is_active !== false, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer update error:", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}

// DELETE - Delete offer
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await pool.execute("DELETE FROM offers WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Offer delete error:", error);
    return NextResponse.json({ error: "Failed to delete offer" }, { status: 500 });
  }
}
