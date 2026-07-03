import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import SaleForm from "./SaleForm";

async function getApprovedCustomers() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT id, name FROM customers WHERE status = 'APPROVED' ORDER BY name ASC");
  return rows;
}

async function getFuelRates() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT fuel_type, price_per_liter FROM fuel_rates");
  const rates = rows.reduce((acc, curr) => {
    acc[curr.fuel_type] = Number(curr.price_per_liter);
    return acc;
  }, {} as Record<string, number>);
  return rates;
}

export default async function SalesPage() {
  const customers = await getApprovedCustomers();
  const rates = await getFuelRates();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Record a Sale</h2>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 max-w-2xl">
        <SaleForm customers={customers as any} rates={rates} />
      </div>
    </div>
  );
}
