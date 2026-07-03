import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import Link from "next/link";
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
    revalidatePath("/admin/customers");
  }
}

async function rejectCustomer(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await pool.query("DELETE FROM customers WHERE id = ?", [Number(id)]);
    revalidatePath("/admin/customers");
  }
}

async function addCustomerDirectly(formData: FormData) {
  "use server";
  const name = formData.get("name");
  const contact = formData.get("contact");
  const address = formData.get("address") || "";
  
  if (name && contact) {
    await pool.query(
      "INSERT INTO customers (name, contact, address, status) VALUES (?, ?, ?, 'APPROVED')",
      [name, contact, address]
    );
    revalidatePath("/admin/customers");
  }
}

export default async function AdminCustomersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const resolvedParams = await searchParams;
  const currentSearch = resolvedParams.search || "";
  const customers = await getCustomers(currentSearch);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800">Manage Customers</h2>
        <CustomerSearch initialQuery={currentSearch} />
      </div>

      {/* Add New Customer Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add Approved Customer</h3>
        <form action={addCustomerDirectly} className="flex flex-col md:flex-row gap-4 md:items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. John Doe" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
            <input type="text" name="contact" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. 1234567890" />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address" className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. 123 Main St" />
          </div>
          <button type="submit" className="w-full md:w-auto bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition">
            Add Customer
          </button>
        </form>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link href={`/admin/customers/${customer.id}`} className="text-blue-600 hover:text-blue-900 hover:underline">
                    {customer.name}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contact}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.address || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.added_by_name || "Admin"}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    customer.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {customer.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {customer.status === 'PENDING' && (
                    <div className="flex gap-2">
                      <form action={approveCustomer}>
                        <input type="hidden" name="id" value={customer.id} />
                        <button type="submit" className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded">Approve</button>
                      </form>
                      <form action={rejectCustomer}>
                        <input type="hidden" name="id" value={customer.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded">Reject</button>
                      </form>
                    </div>
                  )}
                  {customer.status === 'APPROVED' && (
                    <Link href={`/admin/customers/${customer.id}`} className="text-gray-500 hover:text-blue-600 flex items-center gap-1">
                       View History
                    </Link>
                  )}
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
