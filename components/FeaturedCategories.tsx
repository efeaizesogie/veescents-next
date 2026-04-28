'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const CATEGORIES = [
  { label: 'Women', sub: 'Elegant & timeless', href: '/store?category=women', image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop', span: 'lg:col-span-2 lg:row-span-2' },
  { label: 'Men', sub: 'Bold & sophisticated', href: '/store?category=men', image: 'https://images.unsplash.com/photo-1590156424570-698d124ec7dd?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Niche Perfumes', sub: 'Rare & exclusive', href: '/store?cat=niche', image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Unisex', sub: 'Shared & modern', href: '/store?category=unisex', image: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Gift Sets', sub: 'Perfect presents', href: '/store?cat=gift_set', image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Celebrity', sub: 'Star-inspired scents', href: '/store?cat=celebrity', image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Body & Beauty', sub: 'Luxe self-care', href: '/store?cat=body_care', image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=800&auto=format&fit=crop', span: '' },
  { label: 'Scented Candles', sub: 'Ambience & warmth', href: '/store?cat=candles', image: 'https://images.unsplash.com/photo-1602178506049-e2a5e3e5e3e5?q=80&w=800&auto=format&fit=crop', span: '' },
];

export default function FeaturedCategories() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent-gold mb-2 block">Explore</span>
            <h2 className="font-serif text-4xl text-accent-dark">Shop by Category</h2>
          </div>
          <Link href="/categories" className="hidden md:flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold hover:text-accent-gold-dark transition-colors">
            All Categories <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 grid-rows-auto lg:grid-rows-2 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`group relative overflow-hidden cursor-pointer ${cat.span} ${cat.span ? 'h-[420px]' : 'h-[200px]'}`}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-500" />
              <div className="absolute inset-0 border border-accent-gold/0 group-hover:border-accent-gold/50 transition-all duration-500" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <p className="text-[10px] uppercase tracking-widest text-accent-gold/80 mb-1">{cat.sub}</p>
                <h3 className={`font-serif ${cat.span ? 'text-3xl' : 'text-xl'} leading-tight`}>{cat.label}</h3>
              </div>
              <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent-gold/0 group-hover:bg-accent-gold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <ArrowRight size={14} className="text-white" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-center md:hidden">
          <Link href="/categories" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent-gold">
            All Categories <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
