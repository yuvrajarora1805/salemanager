"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

interface WebsiteImage {
  name: string;
  url: string;
  size: number;
  updatedAt: string;
}

export default function WebsiteImagesAdmin() {
  const [images, setImages] = useState<WebsiteImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch("/api/website-images");
      const data = await res.json();
      if (data.images) {
        setImages(data.images);
      }
    } catch {
      showMessage("error", "Failed to fetch website images");
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

  const handleReplaceClick = (filename: string) => {
    setSelectedTarget(filename);
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTarget) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"];
    if (!allowedTypes.includes(file.type)) {
      showMessage("error", "Invalid file type. Only JPEG, PNG, WebP, GIF, and AVIF are allowed.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showMessage("error", "File too large. Maximum size is 10MB.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(selectedTarget);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("targetFilename", selectedTarget);

      const res = await fetch("/api/website-images", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      showMessage("success", `Image ${selectedTarget} replaced successfully!`);
      fetchImages(); // Refresh the list
    } catch (err: any) {
      showMessage("error", err.message || "Failed to replace image");
    } finally {
      setUploading(null);
      setSelectedTarget(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Website Static Images</h2>
          <p className="text-gray-500 text-sm mt-1">
            Replace static images used across the main website. Note: Changes may take time to reflect on user browsers due to caching.
          </p>
        </div>
      </div>

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

      {/* Hidden file input for Replace */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
        className="hidden"
        onChange={handleFileInput}
      />

      {images.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-gray-500 text-sm mb-6">No static images found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img.name} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <div className="relative w-full h-48 bg-gray-100">
                <Image
                  src={`${img.url}?t=${new Date(img.updatedAt).getTime()}`} // Bypass local cache by appending timestamp
                  alt={img.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm truncate" title={img.name}>
                  {img.name}
                </p>
                <div className="text-xs text-gray-400 mt-1 flex justify-between">
                  <span>Size: {formatSize(img.size)}</span>
                  <span>{new Date(img.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => handleReplaceClick(img.name)}
                    disabled={uploading === img.name}
                    className="w-full text-xs font-semibold py-2 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-all disabled:opacity-50"
                  >
                    {uploading === img.name ? "Uploading..." : "Replace Image"}
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
