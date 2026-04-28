'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from './ProductCard';

const EXCHANGE_RATE = 1600;

export default function ProductDetails({ id }: { id: number }) {
  const { products, addToCart } = useStore();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const product = products.find(p => p.id === id);

  if (!product) {
    return (
      <div className="pt-40 text-center text-gray-500 min-h-screen">
        <p>Product not found.</p>
        <Link href="/store" className="text-accent-gold underline mt-4 inline-block">Back to Store</Link>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-accent-gold mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Store
        </button>

        <div className="bg-white rounded-sm shadow-sm p-6 md:p-12 mb-20">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="w-full md:w-1/2">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm relative">
                <Image src={product.image} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                {(product.isNew || product.isNewProduct) && (
                  <span className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-dark shadow-sm">
                    New Arrival
                  </span>
                )}
              </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <div className="mb-2 text-gray-500 text-sm font-bold uppercase tracking-widest">{product.brand}</div>
              <h1 className="font-serif text-4xl md:text-5xl text-accent-dark mb-4">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex text-accent-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < product.rating ? 'currentColor' : 'none'} className={i < product.rating ? '' : 'text-gray-300'} />
                  ))}
                </div>
                <span className="text-gray-400 text-sm">(124 Reviews)</span>
              </div>

              <div className="text-3xl text-accent-gold font-medium mb-8">₦{(product.price * EXCHANGE_RATE).toLocaleString()}</div>

              <p className="text-gray-600 leading-relaxed mb-8">
                Experience the essence of luxury with {product.name} by {product.brand}.
                This signature scent features top notes of bergamot and jasmine,
                blended with a heart of white florals and a base of rich musk and vanilla.
                Perfect for any occasion where you want to leave a lasting impression.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <div className="flex items-center border border-gray-200 rounded-sm">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-3 hover:bg-gray-50 text-gray-500 transition-colors">-</button>
                  <span className="px-4 font-bold min-w-[3rem] text-center">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-3 hover:bg-gray-50 text-gray-500 transition-colors">+</button>
                </div>
                <button
                  onClick={() => { for (let i = 0; i < quantity; i++) addToCart(product); }}
                  className="flex-1 bg-accent-dark text-white py-3 px-8 uppercase font-bold tracking-widest hover:bg-accent-gold transition-all shadow-lg"
                >
                  Add to Cart
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 text-xs text-gray-500">
                <div className="flex flex-col items-center text-center gap-2"><Truck size={24} className="text-accent-dark" /><span>Free Delivery in Nigeria</span></div>
                <div className="flex flex-col items-center text-center gap-2"><Shield size={24} className="text-accent-dark" /><span>Authentic & Verified</span></div>
                <div className="flex flex-col items-center text-center gap-2"><RefreshCw size={24} className="text-accent-dark" /><span>7 Day Return Policy</span></div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <h3 className="font-serif text-3xl text-accent-dark mb-8">You May Also Like</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
