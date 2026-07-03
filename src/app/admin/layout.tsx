import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminNav from "@/components/AdminNav";

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 overflow-hidden">
      
      <AdminNav />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full">
        <header className="bg-white shadow-sm border-b px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40 hidden md:flex">
          <h1 className="text-lg md:text-xl font-semibold text-gray-800 truncate">Welcome, {session.user.name}</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Mobile Welcome */}
          <div className="md:hidden mb-6 flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center text-xl">
              {session.user.name?.[0]?.toUpperCase()}
            </div>
            <h1 className="text-xl font-semibold text-gray-800">Welcome, {session.user.name}</h1>
          </div>
          
          {children}
        </div>
      </main>
    </div>
  );
}
