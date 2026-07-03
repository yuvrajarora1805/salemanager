import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";

async function getCustomers() {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT c.*, u.name as added_by_name 
    FROM customers c 
    LEFT JOIN users u ON c.added_by = u.id
    ORDER BY c.created_at DESC
  `);
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
  if (name && contact) {
    await pool.query(
      "INSERT INTO customers (name, contact, status) VALUES (?, ?, 'APPROVED')",
      [name, contact]
    );
    revalidatePath("/admin/customers");
  }
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Customers</h2>

      {/* Add New Customer Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add Approved Customer</h3>
        <form action={addCustomerDirectly} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
            <input type="text" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. John Doe" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Info</label>
            <input type="text" name="contact" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. 1234567890" />
          </div>
          <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition">
            Add Customer
          </button>
        </form>
      </div>

      {/* Customer List Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.contact}</td>
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
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">No customers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
