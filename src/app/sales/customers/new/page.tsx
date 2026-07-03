import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

async function requestCustomer(formData: FormData) {
  "use server";
  
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) return;

  const name = formData.get("name");
  const contact = formData.get("contact");

  if (name && contact) {
    await pool.query(
      "INSERT INTO customers (name, contact, status, added_by) VALUES (?, ?, 'PENDING', ?)",
      [name, contact, Number(session.user.id)]
    );
    revalidatePath("/sales/customers/new");
  }
}

async function getPendingCustomers(salesmanId: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, contact, created_at FROM customers WHERE status = 'PENDING' AND added_by = ? ORDER BY created_at DESC",
    [Number(salesmanId)]
  );
  return rows;
}

export default async function NewCustomerRequestPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const pendingCustomers = await getPendingCustomers(session.user.id);

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Customer</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Request Form */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-fit">
          <p className="text-gray-600 mb-6">
            Submit a new customer. The customer will be added with a <span className="font-semibold text-yellow-600">PENDING</span> status and must be approved by an Administrator before you can record sales for them.
          </p>

          <form action={requestCustomer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" 
                placeholder="e.g. Acme Logistics" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
              <input 
                type="text" 
                name="contact" 
                required 
                className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" 
                placeholder="e.g. 9876543210" 
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition mt-4">
              Request Approval
            </button>
          </form>
        </div>

        {/* Pending List */}
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold mb-4 text-gray-700">Your Pending Requests</h3>
          <ul className="divide-y divide-gray-200">
            {pendingCustomers.map(c => (
              <li key={c.id} className="py-4 flex justify-between items-center">
                <div>
                  <p className="text-gray-900 font-medium">{c.name}</p>
                  <p className="text-gray-500 text-sm">{c.contact}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">PENDING</span>
              </li>
            ))}
            {pendingCustomers.length === 0 && (
              <li className="py-4 text-gray-500 text-sm text-center">No pending customer requests.</li>
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
