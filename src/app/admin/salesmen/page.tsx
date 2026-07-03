import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import bcrypt from "bcrypt";

async function getSalesmen() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, created_at FROM users WHERE role = 'SALESMAN' ORDER BY created_at DESC"
  );
  return rows;
}

async function addSalesman(formData: FormData) {
  "use server";
  
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (name && email && password) {
    // Check if email already exists
    const [existing] = await pool.query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?", [email]
    );

    if (existing.length > 0) {
      // In a real app, you'd handle this more gracefully, but for simplicity we'll just return
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'SALESMAN')",
      [name, email, passwordHash]
    );
    
    revalidatePath("/admin/salesmen");
  }
}

async function removeSalesman(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await pool.query("DELETE FROM users WHERE id = ? AND role = 'SALESMAN'", [Number(id)]);
    revalidatePath("/admin/salesmen");
  }
}

export default async function AdminSalesmenPage() {
  const salesmen = await getSalesmen();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Salesmen</h2>

      {/* Add New Salesman Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 max-w-3xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Salesman</h3>
        <form action={addSalesman} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. Jane Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. jane@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="Set password" minLength={6} />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition">
              Create Salesman Account
            </button>
          </div>
        </form>
      </div>

      {/* Salesmen List Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salesmen.map((salesman) => (
              <tr key={salesman.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{salesman.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{salesman.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(salesman.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <form action={removeSalesman}>
                    <input type="hidden" name="id" value={salesman.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {salesmen.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No salesmen found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
