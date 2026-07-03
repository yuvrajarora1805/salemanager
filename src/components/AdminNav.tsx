"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { href: "/admin/salesmen", label: "Salesmen", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: "/admin/rates", label: "Fuel Rates", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { href: "/admin/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-900 text-white flex-col flex-shrink-0 min-h-screen">
        <div className="p-6 border-b border-slate-700 flex items-center gap-3">
          <Image src="/logo.png" alt="Fuel Pump Logo" width={40} height={40} className="rounded-full bg-white p-1" />
          <div>
            <h2 className="text-xl font-bold">Admin Panel</h2>
            <p className="text-slate-400 text-xs mt-1">FuelPump Manager</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                </svg>
                <span className="font-medium">{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <Link href="/api/auth/signout" className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-500/10 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-semibold">Logout</span>
          </Link>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-900 text-white sticky top-0 z-50 shadow-md">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Logo" width={32} height={32} className="rounded-full bg-white p-0.5" />
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md bg-slate-800 text-slate-300 hover:text-white focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-900 border-t border-slate-700 shadow-xl py-2 px-4 flex flex-col gap-1 pb-6 animate-in slide-in-from-top-2">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <hr className="border-slate-700 my-2" />
            <Link 
              href="/api/auth/signout" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
