'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';

const categories = [
  { id: 'women', label: 'Women', image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1000&auto=format&fit=crop', desc: 'Feminine, floral, and elegant scents designed to captivate.' },
  { id: 'men', label: 'Men', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=1000&auto=format&fit=crop', desc: 'Bold, woody, and spicy fragrances for the modern man.' },
  { id: 'unisex', label: 'Unisex', image: 'https://images.unsplash.com/photo-1512777576255-a876cea05f8e?q=80&w=1000&auto=format&fit=crop', desc: 'Universal appeal with balanced notes for everyone.' },
];

export default function CategoriesPage() {
  const router = useRouter();

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Categories" subtitle="Discover fragrances by collection" />
        <div className="grid gap-12">
          {categories.map((cat, idx) => (
            <div
              key={cat.id}
              className={`flex flex-col md:flex-row items-center gap-8 bg-white p-6 rounded-sm shadow-sm cursor-pointer group ${idx % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
              onClick={() => router.push(`/store?category=${cat.id}`)}
            >
              <div className="w-full md:w-1/2 h-64 md:h-96 overflow-hidden relative">
                <Image src={cat.image} alt={cat.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="w-full md:w-1/2 text-center md:text-left md:px-12">
                <h3 className="font-serif text-4xl md:text-5xl text-accent-dark mb-4">{cat.label}</h3>
                <p className="text-gray-500 mb-8 max-w-md mx-auto md:mx-0">{cat.desc}</p>
                <button className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-dark transition-colors">
                  Shop {cat.label} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
