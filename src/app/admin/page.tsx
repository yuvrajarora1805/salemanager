import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import HiddenCurrency from "@/components/HiddenCurrency";

async function getDashboardStats() {
  const [salesRows] = await pool.query<RowDataPacket[]>(`
    SELECT 
      fuel_type,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN quantity ELSE 0 END) as today_qty,
      SUM(CASE WHEN DATE(created_at) = CURDATE() THEN total_price ELSE 0 END) as today_rev,
      SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN quantity ELSE 0 END) as week_qty,
      SUM(CASE WHEN created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN total_price ELSE 0 END) as week_rev,
      SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN quantity ELSE 0 END) as year_qty,
      SUM(CASE WHEN YEAR(created_at) = YEAR(CURDATE()) THEN total_price ELSE 0 END) as year_rev
    FROM sales
    GROUP BY fuel_type;
  `);

  const [pendingRows] = await pool.query<RowDataPacket[]>("SELECT COUNT(*) as count FROM customers WHERE status = 'PENDING'");
  
  return {
    salesStats: salesRows,
    pendingCustomers: pendingRows[0]?.count || 0
  };
}

export default async function AdminDashboard() {
  const { salesStats, pendingCustomers } = await getDashboardStats();

  const getStat = (fuel: string, field: string) => {
    const row = salesStats.find((r: any) => r.fuel_type === fuel);
    return Number(row?.[field] || 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount) + ' Rupees';
  };

  const formatLiters = (amount: number) => {
    return new Intl.NumberFormat('en-IN').format(amount) + ' Liters';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        {pendingCustomers > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1 rounded-full">
            {pendingCustomers} Pending Approvals
          </span>
        )}
      </div>
      
      {/* MS (PETROL) Section */}
      <h3 className="text-xl font-bold text-orange-600 mb-4 border-b pb-2">MS (Petrol) Sales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">Today</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('PETROL', 'today_qty'))}</p>
          <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(getStat('PETROL', 'today_rev'))}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">This Week</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('PETROL', 'week_qty'))}</p>
          <HiddenCurrency amount={formatCurrency(getStat('PETROL', 'week_rev'))} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">This Year</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('PETROL', 'year_qty'))}</p>
          <HiddenCurrency amount={formatCurrency(getStat('PETROL', 'year_rev'))} />
        </div>
      </div>

      {/* HSD (DIESEL) Section */}
      <h3 className="text-xl font-bold text-blue-600 mb-4 border-b pb-2">HSD (Diesel) Sales</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">Today</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('DIESEL', 'today_qty'))}</p>
          <p className="text-sm font-semibold text-green-600 mt-1">{formatCurrency(getStat('DIESEL', 'today_rev'))}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">This Week</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('DIESEL', 'week_qty'))}</p>
          <HiddenCurrency amount={formatCurrency(getStat('DIESEL', 'week_rev'))} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500 uppercase">This Year</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">{formatLiters(getStat('DIESEL', 'year_qty'))}</p>
          <HiddenCurrency amount={formatCurrency(getStat('DIESEL', 'year_rev'))} />
        </div>
      </div>
    </div>
  );
}
