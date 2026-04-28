'use client';

import React from 'react';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

const EXCHANGE_RATE = 1;

export default function CartPanel() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useStore();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsCartOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-serif text-2xl text-accent-dark">Shopping Cart ({cart.length})</h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors group">
            <X className="text-gray-400 group-hover:text-accent-gold" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <ShoppingBag size={48} className="opacity-20" />
              <p>Your cart is empty.</p>
              <button onClick={() => setIsCartOpen(false)} className="text-accent-gold underline text-sm">Continue Shopping</button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 animate-fade-in">
                <div className="w-20 h-24 bg-gray-50 flex-shrink-0 overflow-hidden rounded-sm border border-gray-100 relative">
                  <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-accent-dark">{item.name}</h3>
                    <p className="text-xs text-gray-500 uppercase">{item.brand}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center border border-gray-200 rounded-sm">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-gray-50 text-gray-500"><Minus size={14} /></button>
                      <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-gray-50 text-gray-500"><Plus size={14} /></button>
                    </div>
                    <span className="font-medium text-sm text-accent-dark">₦{(item.price * item.quantity * EXCHANGE_RATE).toLocaleString()}</span>
                  </div>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-accent-gold self-start p-1"><Trash2 size={16} /></button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-serif text-xl font-bold text-accent-dark">₦{(cartTotal * EXCHANGE_RATE).toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-400 mb-6 text-center">Shipping and taxes calculated at checkout.</p>
            <button className="w-full bg-accent-dark text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-accent-gold transition-colors shadow-lg">
              Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
