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
    return new Intl.NumberFormat('en-IN').format(amount) + ' L';
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard Overview</h2>
        {pendingCustomers > 0 && (
          <span className="bg-red-100 text-red-800 text-sm font-semibold px-3 py-1.5 rounded-full w-fit">
            {pendingCustomers} Pending Approvals
          </span>
        )}
      </div>
      
      {/* Side by side columns for mobile and desktop */}
      <div className="grid grid-cols-2 gap-4 md:gap-8">
        
        {/* MS (PETROL) Column */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-orange-600 mb-4 border-b border-orange-200 pb-2">MS (Petrol)</h3>
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-orange-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">Today</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('PETROL', 'today_qty'))}</p>
              <p className="text-xs md:text-sm font-semibold text-green-600 mt-1">{formatCurrency(getStat('PETROL', 'today_rev'))}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">This Week</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('PETROL', 'week_qty'))}</p>
              <HiddenCurrency amount={formatCurrency(getStat('PETROL', 'week_rev'))} />
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">This Year</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('PETROL', 'year_qty'))}</p>
              <HiddenCurrency amount={formatCurrency(getStat('PETROL', 'year_rev'))} />
            </div>
          </div>
        </div>

        {/* HSD (DIESEL) Column */}
        <div>
          <h3 className="text-lg md:text-xl font-bold text-blue-600 mb-4 border-b border-blue-200 pb-2">HSD (Diesel)</h3>
          <div className="flex flex-col gap-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-blue-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">Today</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('DIESEL', 'today_qty'))}</p>
              <p className="text-xs md:text-sm font-semibold text-green-600 mt-1">{formatCurrency(getStat('DIESEL', 'today_rev'))}</p>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">This Week</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('DIESEL', 'week_qty'))}</p>
              <HiddenCurrency amount={formatCurrency(getStat('DIESEL', 'week_rev'))} />
            </div>
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs md:text-sm font-medium text-gray-500 uppercase">This Year</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 mt-1 md:mt-2">{formatLiters(getStat('DIESEL', 'year_qty'))}</p>
              <HiddenCurrency amount={formatCurrency(getStat('DIESEL', 'year_rev'))} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
