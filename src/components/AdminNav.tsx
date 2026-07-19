"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { href: "/admin/sales", label: "Record a Sale", icon: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" },
    { href: "/admin/customers", label: "Customers", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
    { href: "/admin/managers", label: "Managers", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
    { href: "/admin/salesmen", label: "Salesmen", icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
    { href: "/admin/rates", label: "Fuel Rates", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { href: "/admin/offers", label: "Offers", icon: "M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" },
    { href: "/admin/analytics", label: "Analytics", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
    { href: "/admin/website-images", label: "Website Images", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
    { href: "/admin/gallery", label: "Gallery", icon: "M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-slate-950 text-white flex-col flex-shrink-0 min-h-screen border-r border-slate-900">
        <div className="p-6 border-b border-slate-900 flex items-center gap-3">
          <div className="w-10 h-10 bg-white p-1 rounded-xl shadow flex items-center justify-center flex-shrink-0">
            <Image src="/logo.png" alt="Goyal Filling Station Logo" width={32} height={32} className="object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-white tracking-tight leading-tight">Goyal Filling</h2>
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-0.5">Admin Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {links.map(link => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-indigo-600/10 font-medium' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}>
                <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                </svg>
                <span className="text-sm">{link.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-slate-900">
          <button onClick={() => signOut({ callbackUrl: '/login' })} className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl transition-colors duration-200 border border-red-500/10">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-semibold">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Navbar */}
      <div className="md:hidden bg-slate-950 text-white sticky top-0 z-50 shadow-md border-b border-slate-900">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white p-0.5 rounded-lg flex items-center justify-center">
              <Image src="/logo.png" alt="Logo" width={24} height={24} className="object-contain" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">Goyal Filling</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg bg-slate-900 text-slate-400 hover:text-white focus:outline-none"
          >
            {isOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-slate-950 border-t border-slate-900 shadow-xl py-2 px-4 flex flex-col gap-1 pb-6 animate-in slide-in-from-top-2">
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm ${isActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium' : 'text-slate-400 hover:bg-slate-900'}`}
                >
                  <svg className="w-5 h-5 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={link.icon} />
                  </svg>
                  <span>{link.label}</span>
                </Link>
              )
            })}
            <hr className="border-slate-900 my-2" />
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })} 
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-slate-900 w-full text-left"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
