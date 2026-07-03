import pool from "@/lib/db";
import { RowDataPacket } from "mysql2";
import { revalidatePath } from "next/cache";

async function getRates() {
  const [rows] = await pool.query<RowDataPacket[]>("SELECT * FROM fuel_rates");
  return rows;
}

async function updateRate(formData: FormData) {
  "use server";
  
  const id = formData.get("id");
  const price = formData.get("price");

  if (id && price) {
    await pool.query("UPDATE fuel_rates SET price_per_liter = ? WHERE id = ?", [
      Number(price),
      Number(id)
    ]);
    revalidatePath("/admin/rates");
  }
}

export default async function RatesPage() {
  const rates = await getRates();

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Manage Fuel Rates</h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fuel Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price Per Liter (₹)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rates.map((rate) => (
              <tr key={rate.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    rate.fuel_type === 'PETROL' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {rate.fuel_type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{Number(rate.price_per_liter).toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(rate.updated_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <form action={updateRate} className="flex items-center space-x-2">
                    <input type="hidden" name="id" value={rate.id} />
                    <input 
                      type="number" 
                      step="0.01" 
                      name="price"
                      defaultValue={rate.price_per_liter}
                      className="border border-gray-300 rounded px-2 py-1 w-24 text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                      required
                    />
                    <button type="submit" className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded">
                      Update
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
