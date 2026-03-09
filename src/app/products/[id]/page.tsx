"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Product } from "@/db/schema";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "used_good",
    location: "Gippsland, VIC",
    status: "draft",
  });

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProduct(data);
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          category: data.category || "",
          condition: data.condition || "used_good",
          location: data.location || "Gippsland, VIC",
          status: data.status || "draft",
        });
      });
  }, [id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setProduct(updated);
    setSaving(false);
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-background p-4 max-w-lg mx-auto">
        <p className="text-gray-400 text-center py-12">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold truncate">{form.title || "Edit Product"}</h1>
        <Link href="/products" className="text-sm text-blue-600 hover:underline">
          ← Back
        </Link>
      </div>

      {/* Images */}
      {(product.images?.length ?? 0) > 0 && (
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(product.images as string[]).map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="w-full aspect-square object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* AI Enhanced badge */}
      {product.aiEnhanced != null && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-sm text-blue-700">
          AI Enhanced — fields below include AI suggestions
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price ($)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="new">New</option>
              <option value="used_like_new">Used - Like New</option>
              <option value="used_good">Used - Good</option>
              <option value="used_fair">Used - Fair</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="draft">Draft</option>
              <option value="enhanced">Enhanced</option>
              <option value="posted">Posted</option>
              <option value="sold">Sold</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-4 bg-blue-500 text-white font-semibold rounded-xl text-lg hover:bg-blue-600 transition disabled:opacity-40"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>

        <button
          type="button"
          onClick={() => {
            if (confirm("Delete this product?")) {
              fetch(`/api/products/${id}`, { method: "DELETE" }).then(() =>
                router.push("/products")
              );
            }
          }}
          className="w-full py-3 text-red-500 text-sm hover:underline"
        >
          Delete Product
        </button>
      </form>
    </main>
  );
}
