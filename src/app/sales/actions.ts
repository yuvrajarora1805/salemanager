"use server";

import pool from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitSale(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    throw new Error("Unauthorized");
  }

  const customerId = formData.get("customerId");
  const fuelType = formData.get("fuelType");
  const quantity = formData.get("quantity");
  const totalPrice = formData.get("totalPrice");

  if (customerId && fuelType && quantity && totalPrice) {
    await pool.query(
      "INSERT INTO sales (customer_id, salesman_id, fuel_type, quantity, total_price) VALUES (?, ?, ?, ?, ?)",
      [Number(customerId), Number(session.user.id), fuelType, Number(quantity), Number(totalPrice)]
    );
    revalidatePath("/admin/analytics"); // Refresh analytics for admin
    return { success: true };
  }
  return { success: false, error: "Invalid data" };
}
