"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/context/StoreContext";
import ProductCard from "@/components/ProductCard";
import { Search, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import RecommendedPerfumes from "@/components/RecommendedPerfumes";

interface Props {
  section: { name: string; slug: string; description?: string };
}

export default function SectionProductsClient({ section }: Props) {
  const { products, isLoading, trackSearch } = useStore();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("default");

  const filtered = useMemo(() => {
    let res = products.filter((p) => p.section === section.slug);
    if (section.slug === "all_products") {
      res = [...products];
    } else if (section.slug === "new_arrivals") {
      res = products
        .filter((p) => p.isNewProduct || p.isNew)
        .sort((a, b) => b.id - a.id);
    } else if (section.slug === "best_sellers") {
      res = [...products]
        .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
        .slice(0, 80);
    } else if (res.length === 0) {
      // Fallback for newly-created sections with no direct assignments yet.
      res = [...products]
        .sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0))
        .slice(0, 40);
    }
    if (search) {
      const q = search.toLowerCase();
      res = res.filter(
        (p) =>
          p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    const out = [...res];
    if (sort === "price-asc") out.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") out.sort((a, b) => b.price - a.price);
    else if (sort === "rating") out.sort((a, b) => b.rating - a.rating);
    else if (sort === "best_selling")
      out.sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
    else if (sort === "newest")
      out.sort((a, b) =>
        a.isNewProduct === b.isNewProduct ? 0 : a.isNewProduct ? -1 : 1
      );
    return out;
  }, [products, section.slug, search, sort]);

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <Link
          href="/sections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-gray-400 hover:text-accent-gold transition-colors mb-8"
        >
          <ArrowLeft size={13} /> All Sections
        </Link>

        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-accent-gold font-medium mb-2">
            Section
          </p>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark">
            {section.name}
          </h1>
          {section.description && (
            <p className="text-gray-400 mt-2 text-sm max-w-lg">
              {section.description}
            </p>
          )}
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-sm shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search by name or brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                trackSearch(e.target.value);
              }}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-accent-dark w-full text-sm"
            />
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={13} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-400">
              {filtered.length} product{filtered.length !== 1 ? "s" : ""}
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-accent-dark bg-white text-sm"
            >
              <option value="default">Sort: Default</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Best Rated</option>
              <option value="best_selling">Best Selling</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-sm aspect-square animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="font-serif text-2xl mb-2">No products found</p>
            <p className="text-sm">This section has no products yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            {filtered.map((p) => (
              <div key={p.id} className="animate-fade-in">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}

        <RecommendedPerfumes
          searchTerm={search}
          section={section.slug}
          excludeIds={filtered.map((p) => p.id)}
        />
      </div>
    </div>
  );
}
