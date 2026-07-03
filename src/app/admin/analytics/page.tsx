import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import AnalyticsFilters from "@/components/AnalyticsFilters";

type SearchParams = {
  range?: string;
  fuel?: string;
  startDate?: string;
  endDate?: string;
}

async function getAnalytics(searchParams: SearchParams) {
  let dateFilter = "";
  let fuelFilter = "";
  const params: any[] = [];
  const p2: any[] = [];

  if (searchParams.range === "today") {
    dateFilter = "AND DATE(s.created_at) = CURDATE()";
  } else if (searchParams.range === "7days") {
    dateFilter = "AND s.created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
  } else if (searchParams.range === "30days") {
    dateFilter = "AND s.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
  } else if (searchParams.range === "custom" && searchParams.startDate && searchParams.endDate) {
    dateFilter = "AND DATE(s.created_at) >= ? AND DATE(s.created_at) <= ?";
    params.push(searchParams.startDate, searchParams.endDate);
    p2.push(searchParams.startDate, searchParams.endDate);
  }

  if (searchParams.fuel && searchParams.fuel !== "all") {
    fuelFilter = "AND s.fuel_type = ?";
    params.push(searchParams.fuel);
    p2.push(searchParams.fuel);
  }

  const queryCustomers = `
    SELECT c.name, SUM(s.quantity) as total_liters, SUM(s.total_price) as total_spent, c.id
    FROM sales s
    JOIN customers c ON s.customer_id = c.id
    WHERE 1=1 ${dateFilter} ${fuelFilter}
    GROUP BY c.id, c.name
    ORDER BY total_spent DESC
  `;

  const querySalesmen = `
    SELECT u.name, SUM(s.quantity) as total_liters, SUM(s.total_price) as total_revenue, COUNT(s.id) as total_transactions
    FROM sales s
    JOIN users u ON s.salesman_id = u.id
    WHERE 1=1 ${dateFilter} ${fuelFilter}
    GROUP BY u.id, u.name
    ORDER BY total_revenue DESC
  `;

  const [salesByCustomer] = await pool.query<RowDataPacket[]>(queryCustomers, params);
  const [salesBySalesman] = await pool.query<RowDataPacket[]>(querySalesmen, p2);

  return { salesByCustomer, salesBySalesman };
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedParams = await searchParams;
  const currentRange = resolvedParams.range || "all";
  const currentFuel = resolvedParams.fuel || "all";
  const currentStart = resolvedParams.startDate || "";
  const currentEnd = resolvedParams.endDate || "";

  const { salesByCustomer, salesBySalesman } = await getAnalytics(resolvedParams);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Analytics</h2>
        <AnalyticsFilters 
          currentRange={currentRange} 
          currentFuel={currentFuel} 
          currentStart={currentStart} 
          currentEnd={currentEnd} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Sales by Customer */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Top Customers</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Liters</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total Spent (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesByCustomer.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      <a href={`/admin/customers/${item.id}`} className="text-blue-600 hover:underline">
                        {item.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{Number(item.total_liters).toFixed(2)} L</td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-semibold">₹{Number(item.total_spent).toFixed(2)}</td>
                  </tr>
                ))}
                {salesByCustomer.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">No data available for selected filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sales by Salesman */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Salesman Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Salesman</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Transactions</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {salesBySalesman.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{item.total_transactions}</td>
                    <td className="px-4 py-3 text-sm text-green-600 font-bold">₹{Number(item.total_revenue).toFixed(2)}</td>
                  </tr>
                ))}
                {salesBySalesman.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-3 text-center text-sm text-gray-500">No data available for selected filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
