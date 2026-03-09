"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Product } from "@/db/schema";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-200 text-gray-700",
  enhanced: "bg-blue-100 text-blue-700",
  posted: "bg-green-100 text-green-700",
  sold: "bg-purple-100 text-purple-700",
};

const STATUSES = ["all", "draft", "enhanced", "posted", "sold"];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered =
    filter === "all" ? products : products.filter((p) => p.status === filter);

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <main className="min-h-screen bg-background p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">
          ← Capture
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-sm capitalize whitespace-nowrap ${
              filter === s
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {s}
            {s !== "all" && (
              <span className="ml-1 opacity-60">
                ({products.filter((p) => p.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-400 text-center py-12">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No products yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
            >
              {/* Thumbnail */}
              <Link href={`/products/${product.id}`}>
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    alt={product.title || ""}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-300 text-3xl">
                    📷
                  </div>
                )}
              </Link>

              <div className="p-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-medium text-sm truncate">
                    {product.title || "Untitled"}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-sm">
                    {product.price ? `$${product.price}` : "No price"}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[product.status || "draft"]}`}
                  >
                    {product.status}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
