"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface Offer {
  id: number;
  title: string;
  description: string;
  image_url: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
}

export default function AdminOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    image_url: "",
    start_date: "",
    end_date: "",
    is_active: true,
  });

  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch("/api/offers");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOffers(data);
      } else {
        throw new Error(data.error || "Failed to fetch offers");
      }
    } catch (err: unknown) {
      showMessage("error", err instanceof Error ? err.message : "Failed to fetch offers");
      setOffers([]); // Fallback to avoid map crash
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const resetForm = () => {
    setForm({ title: "", description: "", image_url: "", start_date: "", end_date: "", is_active: true });
    setEditingId(null);
    setShowForm(false);
  };

  /* ─── File Upload ─── */
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      showMessage("error", "Invalid file type.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showMessage("error", "File too large. Max 10MB.");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/gallery/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setForm((prev) => ({ ...prev, image_url: data.url }));
      showMessage("success", `Image uploaded!`);
    } catch (err: unknown) {
      showMessage("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  /* ─── Form Submit ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) { showMessage("error", "Title is required."); return; }
    setSaving(true);
    try {
      const url = editingId ? `/api/offers/${editingId}` : "/api/offers";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      showMessage("success", editingId ? "Offer updated!" : "Offer created!");
      resetForm();
      fetchOffers();
    } catch {
      showMessage("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (offer: Offer) => {
    setForm({
      title: offer.title,
      description: offer.description,
      image_url: offer.image_url || "",
      start_date: offer.start_date ? offer.start_date.split("T")[0] : "",
      end_date: offer.end_date ? offer.end_date.split("T")[0] : "",
      is_active: offer.is_active,
    });
    setEditingId(offer.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this offer?")) return;
    try {
      const res = await fetch(`/api/offers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showMessage("success", "Offer deleted!");
      fetchOffers();
    } catch {
      showMessage("error", "Failed to delete.");
    }
  };

  const toggleActive = async (offer: Offer) => {
    try {
      await fetch(`/api/offers/${offer.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...offer, is_active: !offer.is_active }),
      });
      fetchOffers();
    } catch {
      showMessage("error", "Failed to toggle status.");
    }
  };

  const formatDate = (d: string | null) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const isExpired = (d: string | null) => {
    if (!d) return false;
    return new Date(d) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Offers Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Create and manage promotional offers shown on the website • {offers.length} offer{offers.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => { if (showForm) resetForm(); else setShowForm(true); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            showForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {showForm ? (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>Cancel</>
          ) : (
            <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>New Offer</>
          )}
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div className={`mb-6 px-5 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 ${
          message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {editingId ? "Edit Offer" : "Create New Offer"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Festival Bonanza: Win a Bike"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
              <textarea
                rows={3}
                placeholder="Describe the offer details..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Offer Image <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              {!form.image_url ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    isDragging ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                  } ${uploading ? "pointer-events-none opacity-60" : ""}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-blue-600 font-semibold text-sm">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-gray-600 text-sm">
                        Drop image or <span className="text-blue-600 font-semibold">browse</span>
                      </p>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="relative w-40 h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 shrink-0">
                    <Image src={form.image_url} alt="Offer" fill className="object-cover" unoptimized />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded font-mono truncate max-w-[200px]">{form.image_url}</span>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => { setForm(p => ({...p, image_url: ""})); }} className="text-red-500 text-xs font-semibold">Remove</button>
                      <button type="button" onClick={() => { setForm(p => ({...p, image_url: ""})); setTimeout(() => fileInputRef.current?.click(), 100); }} className="text-blue-600 text-xs font-semibold">Replace</button>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input
                  type="date"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
              <span className="text-sm text-gray-700 font-medium">Active on website</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all disabled:opacity-50">
                {saving ? "Saving..." : editingId ? "Update Offer" : "Create Offer"}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-100 text-gray-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Offers List */}
      {offers.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <span className="text-5xl mb-4 block">🎉</span>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No offers yet</h3>
          <p className="text-gray-500 text-sm mb-6">Create your first promotional offer.</p>
          <button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all">
            Create First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
                !offer.is_active ? "border-red-200 opacity-60" : isExpired(offer.end_date) ? "border-amber-200" : "border-gray-100"
              }`}
            >
              {/* Image / Gradient Banner */}
              <div className="relative h-40 bg-gradient-to-br from-[#0A2240] to-[#0099D8] flex items-center justify-center overflow-hidden">
                {offer.image_url ? (
                  <Image src={offer.image_url} alt={offer.title} fill className="object-cover" unoptimized />
                ) : (
                  <span className="text-5xl">🎉</span>
                )}
                {/* Status badges */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  {!offer.is_active ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-red-500 text-white">Hidden</span>
                  ) : isExpired(offer.end_date) ? (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500 text-white">Expired</span>
                  ) : (
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-500 text-white">Active</span>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h4 className="font-bold text-gray-800 mb-2 line-clamp-2">{offer.title}</h4>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{offer.description || "No description"}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span>{formatDate(offer.start_date)} → {formatDate(offer.end_date)}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button onClick={() => toggleActive(offer)} className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${offer.is_active ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200" : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"}`}>
                    {offer.is_active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => handleEdit(offer)} className="flex-1 text-xs font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(offer.id)} className="text-xs font-semibold py-2 px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
