'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

const CATEGORY_IMAGES: Record<string, string> = {
  women: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop',
  men: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop',
  unisex: 'https://images.unsplash.com/photo-1512777576255-a876cea05f8e?q=80&w=1000&auto=format&fit=crop',
};
const FALLBACK = 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=1000&auto=format&fit=crop';

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Categories" subtitle="Discover fragrances by category" />

        {loading ? (
          <div className="grid gap-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-white rounded-sm animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-12">
            {categories.map((cat, idx) => (
              <div
                key={cat._id}
                className={`flex flex-col md:flex-row items-center gap-0 bg-white rounded-sm shadow-sm overflow-hidden cursor-pointer group ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                onClick={() => router.push(`/store?category=${cat.slug}`)}
              >
                <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden relative">
                  <Image
                    src={CATEGORY_IMAGES[cat.slug] || FALLBACK}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>
                <div className="w-full md:w-1/2 text-center md:text-left p-8 md:px-14">
                  <h3 className="font-serif text-4xl md:text-5xl text-accent-dark mb-4">{cat.name}</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto md:mx-0">
                    {cat.description || `Shop our ${cat.name.toLowerCase()} fragrance collection.`}
                  </p>
                  <button className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-dark transition-colors">
                    Shop {cat.name} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
