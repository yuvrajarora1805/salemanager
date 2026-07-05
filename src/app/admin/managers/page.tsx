import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

async function getManagers() {
  const [rows] = await pool.query<RowDataPacket[]>(
    "SELECT id, name, email, created_at FROM users WHERE role = 'MANAGER' ORDER BY created_at DESC"
  );
  return rows;
}

async function addManager(formData: FormData) {
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
      redirect("/admin/managers?error=email_exists");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'MANAGER')",
      [name, email, passwordHash]
    );
    
    revalidatePath("/admin/managers");
    redirect("/admin/managers");
  }
}

async function removeManager(formData: FormData) {
  "use server";
  const id = formData.get("id");
  if (id) {
    await pool.query("DELETE FROM users WHERE id = ? AND role = 'MANAGER'", [Number(id)]);
    revalidatePath("/admin/managers");
  }
}

export default async function AdminManagersPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const resolvedParams = await searchParams;
  const error = resolvedParams.error;
  const managers = await getManagers();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Managers</h2>

      {error === "email_exists" && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 max-w-3xl" role="alert">
          <p className="font-bold">Error</p>
          <p className="text-sm">A user with this email address already exists. Please choose a different email.</p>
        </div>
      )}

      {/* Add New Manager Form */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 max-w-3xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Manager</h3>
        <form action={addManager} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" name="name" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="e.g. manager@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password" name="password" required className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" placeholder="Set password" minLength={6} />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-6 rounded hover:bg-blue-700 transition">
              Create Manager Account
            </button>
          </div>
        </form>
      </div>

      {/* Managers List Table */}
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
            {managers.map((manager) => (
              <tr key={manager.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{manager.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{manager.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(manager.created_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <form action={removeManager}>
                    <input type="hidden" name="id" value={manager.id} />
                    <button type="submit" className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">
                      Remove
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {managers.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-gray-500">No managers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
