import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar / Topbar on mobile */}
      <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0">
        <div className="p-4 md:p-6 border-b border-slate-700 flex justify-between items-center md:block">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Fuel Pump Logo" width={40} height={40} className="rounded-full bg-white p-1" />
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Admin Panel</h2>
              <p className="text-slate-400 text-xs md:text-sm mt-1">FuelPump Manager</p>
            </div>
          </div>
          <div className="md:hidden">
            <Link href="/api/auth/signout" className="text-sm bg-red-600 px-3 py-1 rounded">Logout</Link>
          </div>
        </div>
        <nav className="flex md:flex-col overflow-x-auto px-2 md:px-4 py-3 md:py-6 space-x-2 md:space-x-0 md:space-y-2 whitespace-nowrap">
          <Link href="/admin" className="inline-block md:block px-4 py-2 rounded hover:bg-slate-800 transition">
            Dashboard
          </Link>
          <Link href="/admin/customers" className="inline-block md:block px-4 py-2 rounded hover:bg-slate-800 transition">
            Customers
          </Link>
          <Link href="/admin/salesmen" className="inline-block md:block px-4 py-2 rounded hover:bg-slate-800 transition">
            Salesmen
          </Link>
          <Link href="/admin/rates" className="inline-block md:block px-4 py-2 rounded hover:bg-slate-800 transition">
            Fuel Rates
          </Link>
          <Link href="/admin/analytics" className="inline-block md:block px-4 py-2 rounded hover:bg-slate-800 transition">
            Analytics
          </Link>
        </nav>
        <div className="hidden md:block p-4 border-t border-slate-700 mt-auto">
          <Link href="/api/auth/signout" className="block w-full text-center px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition">
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">Welcome, {session.user.name}</h1>
        </header>
        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
