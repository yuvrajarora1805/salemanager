import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// PUT - Update gallery image
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
    const { image_url, caption, category, display_order, is_active } = body;

    await pool.execute(
      "UPDATE gallery_images SET image_url = ?, caption = ?, category = ?, display_order = ?, is_active = ? WHERE id = ?",
      [image_url, caption || "", category || "Station", display_order || 0, is_active !== false, id]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery update error:", error);
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 });
  }
}

// DELETE - Delete gallery image
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
    await pool.execute("DELETE FROM gallery_images WHERE id = ?", [id]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Gallery delete error:", error);
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 });
  }
}
