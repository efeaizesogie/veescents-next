'use client';

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';

interface RecommendedPerfumesProps {
  title?: string;
  searchTerm?: string;
  category?: string;
  section?: string;
  collection?: string;
  excludeIds?: number[];
}

function hashText(text: string) {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) h = (h * 31 + text.charCodeAt(i)) >>> 0;
  return h;
}

export default function RecommendedPerfumes({
  title = 'Recommended Perfumes',
  searchTerm,
  category,
  section,
  collection,
  excludeIds = [],
}: RecommendedPerfumesProps) {
  const pathname = usePathname();
  const { products, isLoading, cart, wishlist, recentlyViewedIds, recentSearches } = useStore();

  const recommended = useMemo(() => {
    const excluded = new Set(excludeIds);
    const searchPool = [searchTerm?.trim().toLowerCase() || '', ...recentSearches].filter(Boolean).slice(0, 5);
    const viewedSet = new Set(recentlyViewedIds.slice(0, 12));
    const cartSet = new Set(cart.map((item) => item.id));
    const wishSet = new Set(wishlist.map((item) => item.id));
    const seed = hashText(`${pathname}|${category || ''}|${section || ''}|${collection || ''}|${new Date().getHours()}`);

    const viewedProducts = products.filter((p) => viewedSet.has(p.id));
    const behaviorCategories = new Set(viewedProducts.map((p) => p.category));
    const behaviorBrands = new Set(viewedProducts.map((p) => p.brand));

    return products
      .filter((p) => !excluded.has(p.id))
      .map((p) => {
        let score = (p.rating || 0) * 8 + (p.salesCount || 0) * 0.2;
        if (category && category !== 'all' && p.category === category) score += 16;
        if (section && p.section === section) score += 16;
        if (collection && (p.collection === collection || p.collectionSlug === collection)) score += 16;
        if (behaviorCategories.has(p.category)) score += 5;
        if (behaviorBrands.has(p.brand)) score += 5;
        if (cartSet.has(p.id) || wishSet.has(p.id) || viewedSet.has(p.id)) score -= 3;
        if (p.isNewProduct) score += 2;
        const searchable = `${p.name} ${p.brand}`.toLowerCase();
        for (const term of searchPool) {
          if (term.length < 2) continue;
          if (searchable.includes(term)) score += 7;
        }
        const variation = ((hashText(`${seed}-${p.id}`) % 1000) / 1000) * 0.9;
        return { product: p, score: score + variation };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map((item) => item.product);
  }, [products, excludeIds, searchTerm, recentSearches, recentlyViewedIds, cart, wishlist, category, section, collection, pathname]);

  return (
    <section className="mt-16 pt-10 border-t border-gray-200">
      <div className="mb-6">
        <h2 className="font-serif text-3xl text-accent-dark">{title}</h2>
        <p className="text-sm text-gray-400 mt-1">Picked for this page based on your recent activity.</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm aspect-square animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {recommended.map((product) => (
            <div key={product.id} className="animate-fade-in">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
