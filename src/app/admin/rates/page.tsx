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
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Manage Fuel Rates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rates.map((rate) => (
          <div key={rate.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden">
            {/* Top color bar indicator */}
            <div className={`absolute top-0 left-0 w-full h-1.5 ${rate.fuel_type === 'PETROL' ? 'bg-orange-500' : 'bg-blue-500'}`}></div>
            
            <div className="flex justify-between items-center mb-6 mt-2">
              <h3 className={`text-xl font-bold ${rate.fuel_type === 'PETROL' ? 'text-orange-600' : 'text-blue-600'}`}>
                {rate.fuel_type}
              </h3>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                Updated: {new Date(rate.updated_at).toLocaleDateString()}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-1">Current Price</p>
              <p className="text-4xl font-black text-gray-800">
                ₹{Number(rate.price_per_liter).toFixed(2)} <span className="text-lg text-gray-500 font-medium">/ Liter</span>
              </p>
            </div>

            <form action={updateRate} className="bg-gray-50 -mx-6 -mb-6 p-6 border-t border-gray-100">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Update Price</label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input type="hidden" name="id" value={rate.id} />
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    name="price"
                    defaultValue={rate.price_per_liter}
                    className="w-full border border-gray-300 rounded-lg pl-8 pr-4 py-2.5 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg hover:bg-blue-700 transition">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
