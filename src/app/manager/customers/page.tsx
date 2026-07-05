import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import CustomerSearch from "@/components/CustomerSearch";

async function getCustomers(searchQuery?: string) {
  let query = `
    SELECT c.*, u.name as added_by_name 
    FROM customers c 
    LEFT JOIN users u ON c.added_by = u.id
  `;
  const params = [];

  if (searchQuery) {
    query += ` WHERE c.name LIKE ? OR c.contact LIKE ? OR c.address LIKE ?`;
    params.push(`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`);
  }

  query += ` ORDER BY c.created_at DESC`;

  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
}

async function approveCustomer(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await pool.query("UPDATE customers SET status = 'APPROVED' WHERE id = ?", [Number(id)]);
    revalidatePath("/manager/customers");
  }
}

async function rejectCustomer(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await pool.query("DELETE FROM customers WHERE id = ?", [Number(id)]);
    revalidatePath("/manager/customers");
  }
}

export default async function ManagerCustomersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || "";
  const customers = await getCustomers(currentSearch);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 w-full">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Approvals</h2>
        <div className="w-full sm:w-auto">
          <CustomerSearch initialQuery={currentSearch} />
        </div>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {customer.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.added_by_name || "Direct / Admin"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {customer.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <form action={approveCustomer}>
                        <input type="hidden" name="id" value={customer.id} />
                        <button type="submit" className="text-green-600 hover:text-green-900 bg-green-50 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">Approve</button>
                      </form>
                      <form action={rejectCustomer}>
                        <input type="hidden" name="id" value={customer.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider">Reject</button>
                      </form>
                    </div>
                  )}
                  {customer.status === 'APPROVED' && (
                    <span className="text-gray-400 text-xs">No actions needed</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-bold rounded-full ${
                    customer.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  {currentSearch ? "No customers found matching your search." : "No customers found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
