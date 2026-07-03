import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import Link from "next/link";
import { notFound } from "next/navigation";
import AnalyticsFilters from "@/components/AnalyticsFilters";

type SearchParams = {
  range?: string;
  fuel?: string;
  startDate?: string;
  endDate?: string;
}

async function getCustomerDetails(id: string) {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM customers WHERE id = ?", [id]);
  return rows[0];
}

async function getCustomerHistory(id: string, searchParams: SearchParams) {
  let dateFilter = "";
  let fuelFilter = "";
  const params: any[] = [id];

  if (searchParams.range === "today") {
    dateFilter = "AND DATE(created_at) = CURDATE()";
  } else if (searchParams.range === "7days") {
    dateFilter = "AND created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)";
  } else if (searchParams.range === "30days") {
    dateFilter = "AND created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)";
  } else if (searchParams.range === "custom" && searchParams.startDate && searchParams.endDate) {
    dateFilter = "AND DATE(created_at) >= ? AND DATE(created_at) <= ?";
    params.push(searchParams.startDate, searchParams.endDate);
  }

  if (searchParams.fuel && searchParams.fuel !== "all") {
    fuelFilter = "AND fuel_type = ?";
    params.push(searchParams.fuel);
  }

  const query = `
    SELECT * 
    FROM sales 
    WHERE customer_id = ? ${dateFilter} ${fuelFilter}
    ORDER BY created_at DESC
  `;

  const [history] = await pool.query<RowDataPacket[]>(query, params);

  const totalLiters = history.reduce((sum, row) => sum + Number(row.quantity), 0);
  const totalSpent = history.reduce((sum, row) => sum + Number(row.total_price), 0);

  return { history, totalLiters, totalSpent };
}

export default async function CustomerHistoryPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<SearchParams> 
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const customer = await getCustomerDetails(resolvedParams.id);
  
  if (!customer) {
    notFound();
  }

  const currentRange = resolvedSearchParams.range || "all";
  const currentFuel = resolvedSearchParams.fuel || "all";
  const currentStart = resolvedSearchParams.startDate || "";
  const currentEnd = resolvedSearchParams.endDate || "";

  const { history, totalLiters, totalSpent } = await getCustomerHistory(resolvedParams.id, resolvedSearchParams);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/customers" className="text-blue-600 hover:underline flex items-center gap-1 text-sm font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Customers
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{customer.name}</h2>
          <p className="text-gray-500">
            Contact: {customer.contact} | Address: {customer.address || "N/A"} | Status: {customer.status}
          </p>
        </div>
        <AnalyticsFilters 
          currentRange={currentRange} 
          currentFuel={currentFuel} 
          currentStart={currentStart} 
          currentEnd={currentEnd} 
        />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Liters (Filtered)</p>
          <p className="text-3xl font-bold text-gray-800 mt-2">{totalLiters.toFixed(2)} L</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 flex flex-col justify-center">
          <p className="text-sm font-medium text-gray-500 uppercase">Total Spent (Filtered)</p>
          <p className="text-3xl font-bold text-green-600 mt-2">₹{totalSpent.toFixed(2)}</p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fuel Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity (Liters)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((sale) => (
              <tr key={sale.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(sale.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    sale.fuel_type === 'PETROL' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {sale.fuel_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Number(sale.quantity).toFixed(2)} L
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  ₹{Number(sale.total_price).toFixed(2)}
                </td>
              </tr>
            ))}
            {history.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No transactions found for this period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
