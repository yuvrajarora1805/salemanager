"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AnalyticsFilters({ 
  currentRange, 
  currentFuel, 
  currentStart, 
  currentEnd 
}: { 
  currentRange: string; 
  currentFuel: string;
  currentStart?: string;
  currentEnd?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [range, setRange] = useState(currentRange);
  const [fuel, setFuel] = useState(currentFuel);
  const [startDate, setStartDate] = useState(currentStart || "");
  const [endDate, setEndDate] = useState(currentEnd || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    
    params.set("range", range);
    params.set("fuel", fuel);
    
    if (range === "custom" && startDate && endDate) {
      params.set("startDate", startDate);
      params.set("endDate", endDate);
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const hasFilters = currentRange !== "all" || currentFuel !== "all";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:items-center bg-white p-3 rounded shadow-sm border border-gray-200 w-full md:w-auto flex-wrap">
      <div className="w-full sm:w-auto">
        <select 
          value={range} 
          onChange={(e) => setRange(e.target.value)} 
          className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="custom">Custom Date Range</option>
        </select>
      </div>

      {range === "custom" && (
        <div className="flex items-center gap-2 w-full sm:w-auto animate-in fade-in slide-in-from-left-2 duration-300">
          <input 
            type="date" 
            value={startDate} 
            onChange={(e) => setStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 w-full sm:w-auto"
            required={range === "custom"}
          />
          <span className="text-gray-500 text-sm">to</span>
          <input 
            type="date" 
            value={endDate} 
            onChange={(e) => setEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700 w-full sm:w-auto"
            required={range === "custom"}
          />
        </div>
      )}

      <div className="w-full sm:w-auto">
        <select 
          value={fuel} 
          onChange={(e) => setFuel(e.target.value)} 
          className="w-full sm:w-auto border border-gray-300 rounded px-2 py-1.5 text-sm text-gray-700"
        >
          <option value="all">All Fuels</option>
          <option value="PETROL">Petrol</option>
          <option value="DIESEL">Diesel</option>
        </select>
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button type="submit" className="flex-1 sm:flex-none bg-blue-600 text-white text-sm font-semibold py-1.5 px-4 rounded hover:bg-blue-700">
          Apply
        </button>
        
        {hasFilters && (
          <Link href={pathname} className="text-sm text-red-500 hover:underline">
            Clear
          </Link>
        )}
      </div>
    </form>
  );
}
