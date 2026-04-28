'use client';

import React from 'react';
import Image from 'next/image';
import { X, Heart, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const EXCHANGE_RATE = 1600;

export default function WishlistPanel() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useStore();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isWishlistOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsWishlistOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isWishlistOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-accent-dark">Wishlist ({wishlist.length})</h2>
          <button onClick={() => setIsWishlistOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <X className="text-gray-400 group-hover:text-accent-gold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <Heart size={48} className="opacity-20" />
              <p>Your wishlist is empty.</p>
              <button onClick={() => setIsWishlistOpen(false)} className="text-accent-gold underline text-sm">Explore Collection</button>
            </div>
          ) : (
            wishlist.map(item => (
              <div key={item.id} className="flex gap-4 animate-fade-in group">
                <div className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded-sm border border-gray-100 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-accent-dark">{item.name}</h3>
                    <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-medium text-sm text-accent-dark">₦{(item.price * EXCHANGE_RATE).toLocaleString()}</span>
                    <button onClick={() => addToCart(item)} className="flex items-center gap-1 text-xs font-bold uppercase text-accent-dark hover:text-accent-gold transition-colors">
                      <ShoppingBag size={12} /> Add
                    </button>
                  </div>
                </div>
                <button onClick={() => toggleWishlist(item)} className="text-gray-300 hover:text-accent-gold self-start p-1"><X size={16} /></button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
