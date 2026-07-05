import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "SALESMAN" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar / Topbar on mobile */}
      <aside className="w-full md:w-64 bg-slate-950 text-white flex flex-col flex-shrink-0 border-r border-slate-900">
        <div className="p-4 md:p-6 border-b border-slate-900 flex justify-between items-center md:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white p-1 rounded-xl shadow flex items-center justify-center flex-shrink-0">
              <Image src="/logo.png" alt="Goyal Filling Logo" width={32} height={32} className="object-contain" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">Goyal Filling</h2>
              <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Sales Portal</p>
            </div>
          </div>
          <div className="md:hidden">
            <LogoutButton className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors font-semibold">Logout</LogoutButton>
          </div>
        </div>
        <nav className="flex md:flex-col overflow-x-auto px-2 md:px-4 py-3 md:py-6 space-x-2 md:space-x-0 md:space-y-1.5 whitespace-nowrap">
          <Link href="/sales" className="inline-block md:block px-4 py-2 text-sm rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition">
            New Sale
          </Link>
          <Link href="/sales/customers/new" className="inline-block md:block px-4 py-2 text-sm rounded-xl text-slate-400 hover:bg-slate-900 hover:text-white transition">
            Add Customer
          </Link>
        </nav>
        <div className="hidden md:block p-4 border-t border-slate-900 mt-auto">
          <LogoutButton className="block w-full text-center px-4 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 border border-red-500/10 rounded-xl text-sm font-semibold transition">
            Logout
          </LogoutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-white shadow-sm border-b px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">Welcome, {session.user.name}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
