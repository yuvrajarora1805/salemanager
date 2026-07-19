"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

interface GalleryImage {
  id: number;
  image_url: string;
  caption: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

const defaultCategories = ["Station", "Team", "Events", "Services"];

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isNewCategory, setIsNewCategory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    image_url: "",
    caption: "",
    category: "Station" as string,
    display_order: 0,
    is_active: true,
  });

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      setImages(data);
    } catch {
      showMessage("error", "Failed to fetch gallery images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const resetForm = () => {
    setForm({ image_url: "", caption: "", category: "Station", display_order: 0, is_active: true });
    setEditingId(null);
    setShowForm(false);
    setIsNewCategory(false);
  };

  /* ─── File Upload Handler ─── */
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      showMessage("error", "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage("error", "File too large. Maximum size is 10MB.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/gallery/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setForm((prev) => ({ ...prev, image_url: data.url }));
      showMessage("success", `Image uploaded: ${data.filename}`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Upload failed";
      showMessage("error", errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  /* ─── Drag & Drop ─── */
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileUpload(file);
  };

  /* ─── Form Submit ─── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.image_url) {
      showMessage("error", "Please upload an image first.");
      return;
    }

    setSaving(true);

    try {
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to save");

      showMessage("success", editingId ? "Image updated!" : "Image added to gallery!");
      resetForm();
      fetchImages();
    } catch {
      showMessage("error", "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (img: GalleryImage) => {
    setForm({
      image_url: img.image_url,
      caption: img.caption,
      category: img.category,
      display_order: img.display_order,
      is_active: img.is_active,
    });
    setEditingId(img.id);
    setShowForm(true);
    setIsNewCategory(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      showMessage("success", "Image deleted!");
      fetchImages();
    } catch {
      showMessage("error", "Failed to delete image.");
    }
  };

  const toggleActive = async (img: GalleryImage) => {
    try {
      await fetch(`/api/gallery/${img.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...img, is_active: !img.is_active }),
      });
      fetchImages();
    } catch {
      showMessage("error", "Failed to toggle status.");
    }
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Gallery Manager</h2>
          <p className="text-gray-500 text-sm mt-1">
            Upload and manage images for the website gallery • {images.length} image{images.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => {
            if (showForm) resetForm();
            else setShowForm(true);
          }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            showForm
              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg"
          }`}
        >
          {showForm ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Image
            </>
          )}
        </button>
      </div>

      {/* Notification */}
      {message && (
        <div
          className={`mb-6 px-5 py-3.5 rounded-xl font-medium text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? "✓" : "✕"} {message.text}
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {editingId ? "Edit Image" : "Upload New Image"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* ─── Upload Area ─── */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image <span className="text-red-500">*</span>
              </label>

              {/* Drag & Drop Zone */}
              {!form.image_url ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50"
                  } ${uploading ? "pointer-events-none opacity-60" : ""}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-blue-600 font-semibold">Uploading...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-700 font-semibold">
                          Drag & drop an image here, or <span className="text-blue-600">click to browse</span>
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          JPEG, PNG, WebP, GIF, AVIF • Max 10MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="hidden"
                    onChange={handleFileInput}
                  />
                </div>
              ) : (
                /* Image Preview */
                <div className="relative">
                  <div className="relative w-full max-w-lg h-56 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <Image
                      src={form.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-mono truncate max-w-xs">
                      {form.image_url}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, image_url: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-red-500 hover:text-red-700 text-sm font-semibold flex items-center gap-1 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Remove
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({ ...prev, image_url: "" }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                        setTimeout(() => fileInputRef.current?.click(), 100);
                      }}
                      className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Replace
                    </button>
                    {/* Hidden file input for Replace */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                      className="hidden"
                      onChange={handleFileInput}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ─── Details ─── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Caption</label>
                <input
                  type="text"
                  placeholder="Photo description"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.caption}
                  onChange={(e) => setForm({ ...form, caption: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                {isNewCategory ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="New category..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                    />
                    <button type="button" onClick={() => { setIsNewCategory(false); setForm({ ...form, category: defaultCategories[0] }); }} className="text-sm font-semibold text-gray-500 hover:text-gray-800">Cancel</button>
                  </div>
                ) : (
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    value={form.category}
                    onChange={(e) => {
                      if (e.target.value === "__NEW__") {
                        setIsNewCategory(true);
                        setForm({ ...form, category: "" });
                      } else {
                        setForm({ ...form, category: e.target.value });
                      }
                    }}
                  >
                    {Array.from(new Set([...defaultCategories, ...images.map(img => img.category)])).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__NEW__" className="font-semibold text-blue-600">+ Add New Category</option>
                  </select>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Display Order</label>
                <input
                  type="number"
                  min={0}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  value={form.display_order}
                  onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
              </label>
              <span className="text-sm text-gray-700 font-medium">Show on website</span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !form.image_url}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editingId ? "Update Image" : "Add to Gallery"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-100 text-gray-700 font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-gray-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
          </svg>
          <h3 className="text-lg font-bold text-gray-800 mb-2">No gallery images yet</h3>
          <p className="text-gray-500 text-sm mb-6">Upload images to build your gallery.</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all"
          >
            Upload First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div
              key={img.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-sm border transition-all hover:shadow-md ${
                img.is_active ? "border-gray-100" : "border-red-200 opacity-60"
              }`}
            >
              {/* Image */}
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={img.image_url}
                  alt={img.caption || "Gallery image"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      img.is_active
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {img.is_active ? "Active" : "Hidden"}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {img.category}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {img.caption || "No caption"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Order: {img.display_order} • {new Date(img.created_at).toLocaleDateString()}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(img)}
                    className={`flex-1 text-xs font-semibold py-2 rounded-lg transition-all ${
                      img.is_active
                        ? "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                    }`}
                  >
                    {img.is_active ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => handleEdit(img)}
                    className="flex-1 text-xs font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="text-xs font-semibold py-2 px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-all"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
