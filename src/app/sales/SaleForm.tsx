"use client";

import { useState, useRef, useEffect } from "react";
import { submitSale } from "./actions";

type Customer = { id: number; name: string };
type Rates = Record<string, number>;

export default function SaleForm({ customers, rates }: { customers: Customer[]; rates: Rates }) {
  const [fuelType, setFuelType] = useState<string>("PETROL");
  const [quantity, setQuantity] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState("");
  
  // Searchable Dropdown State
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPricePerLiter = rates[fuelType] || 0;
  const totalPrice = (quantity * currentPricePerLiter).toFixed(2);

  const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCustomerId) {
      alert("Please select a customer.");
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.append("customerId", selectedCustomerId.toString());
    formData.append("totalPrice", totalPrice);
    
    const result = await submitSale(formData);
    if (result.success) {
      setSuccessMsg("Sale recorded successfully!");
      setQuantity(0);
      setSelectedCustomerId(null);
      setSearch("");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {successMsg && (
        <div className="bg-green-100 text-green-700 p-3 rounded text-sm mb-4">
          {successMsg}
        </div>
      )}

      {/* Custom Searchable Dropdown for Customer */}
      <div className="relative" ref={dropdownRef}>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
        
        <div 
          className="w-full border border-gray-300 rounded px-3 py-2 text-black bg-white cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedCustomer ? selectedCustomer.name : "-- Search & Choose a Customer --"}</span>
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto">
            <div className="p-2 border-b sticky top-0 bg-white">
              <input
                type="text"
                placeholder="Search customers..."
                className="w-full border border-gray-300 rounded px-2 py-1 text-sm text-black focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
            </div>
            <ul>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(c => (
                  <li 
                    key={c.id} 
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-800"
                    onClick={() => {
                      setSelectedCustomerId(c.id);
                      setIsOpen(false);
                      setSearch("");
                    }}
                  >
                    {c.name}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-500">No customers found.</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
        <select 
          name="fuelType" 
          value={fuelType} 
          onChange={(e) => setFuelType(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500 bg-white"
        >
          <option value="PETROL">Petrol (₹{rates["PETROL"] || 0}/L)</option>
          <option value="DIESEL">Diesel (₹{rates["DIESEL"] || 0}/L)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity (Liters)</label>
        <input 
          type="number" 
          name="quantity"
          step="0.01" 
          min="0.01"
          value={quantity || ""}
          onChange={(e) => setQuantity(Number(e.target.value))}
          required 
          className="w-full border border-gray-300 rounded px-3 py-2 text-black focus:ring-blue-500" 
          placeholder="e.g. 10.5" 
        />
      </div>

      <div className="bg-gray-50 p-4 rounded border border-gray-200 flex justify-between items-center">
        <span className="text-gray-600 font-medium">Total Price:</span>
        <span className="text-2xl font-bold text-gray-900">₹{totalPrice}</span>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded hover:bg-blue-700 transition">
        Confirm Sale
      </button>
    </form>
  );
}
