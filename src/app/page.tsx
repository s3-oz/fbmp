"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const QUICK_PRICES = [5, 10, 20, 50, 100];

export default function CapturePage() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addImages(files: FileList | null) {
    if (!files) return;
    const newFiles = Array.from(files).slice(0, 10 - images.length);
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...newFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!images.length) return;
    setSubmitting(true);

    try {
      // Upload images
      const formData = new FormData();
      images.forEach((f) => formData.append("files", f));
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { urls } = await uploadRes.json();

      // Create product
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: description.slice(0, 80) || "Untitled",
          description,
          price: price || null,
          images: urls,
        }),
      });

      // Reset
      previews.forEach((p) => URL.revokeObjectURL(p));
      setImages([]);
      setPreviews([]);
      setDescription("");
      setPrice("");
      setToast("Saved! Ready for next item.");
      setTimeout(() => setToast(""), 3000);
    } catch {
      setToast("Error saving. Try again.");
      setTimeout(() => setToast(""), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">FBMP</h1>
        <Link
          href="/products"
          className="text-sm text-blue-600 hover:underline"
        >
          View Products →
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Camera / file input */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => addImages(e.target.files)}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={images.length >= 10}
            className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 text-lg hover:border-blue-400 hover:text-blue-500 transition disabled:opacity-40"
          >
            {images.length === 0
              ? "Tap to add photos"
              : `Add more (${images.length}/10)`}
          </button>
        </div>

        {/* Image previews */}
        {previews.length > 0 && (
          <div className="grid grid-cols-4 gap-2">
            {previews.map((src, i) => (
              <div key={i} className="relative aspect-square">
                <img
                  src={src}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is it? Brief description..."
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Quick price buttons */}
        <div>
          <div className="flex gap-2 flex-wrap">
            {QUICK_PRICES.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPrice(String(p))}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  price === String(p)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                ${p}
              </button>
            ))}
            <input
              type="number"
              value={QUICK_PRICES.includes(Number(price)) ? "" : price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Custom $"
              className="w-24 px-3 py-2 border border-gray-300 rounded-full text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || images.length === 0}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-xl text-lg hover:bg-blue-600 transition disabled:opacity-40"
        >
          {submitting ? "Saving..." : "Save Item"}
        </button>
      </form>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-lg text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
