'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { Product, CartItem } from '@/types';

interface StoreContextType {
  products: Product[];
  newCollection: Product[];
  galleryProducts: Product[];
  isLoading: boolean;
  error: string | null;
  cart: CartItem[];
  wishlist: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, delta: number) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (v: boolean) => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (v: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_KEY = 'veescents_cart';
const WISH_KEY = 'veescents_wishlist';

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoaded } = useUser();
  const userId = user?.id ?? null;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [syncReady, setSyncReady] = useState(false);

  // Fetch products from DB
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Load cart + wishlist once auth is resolved
  useEffect(() => {
    if (!isLoaded) return;

    if (userId) {
      // Logged in — load from DB
      Promise.all([
        fetch('/api/user/cart').then(r => r.json()),
        fetch('/api/user/wishlist').then(r => r.json()),
      ]).then(([cartData, wishData]) => {
        // Merge guest localStorage cart into DB cart
        const guestCart: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const guestWish: Product[] = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');

        const dbItems: CartItem[] = (cartData.items || []).map((i: { productId: number; quantity: number }) => {
          const p = products.find(x => x.id === i.productId);
          return p ? { ...p, quantity: i.quantity } : null;
        }).filter(Boolean);

        // Merge: guest items not already in DB cart
        const merged = [...dbItems];
        for (const g of guestCart) {
          if (!merged.find(m => m.id === g.id)) merged.push(g);
        }

        const dbWishIds: number[] = wishData.productIds || [];
        const dbWish = products.filter(p => dbWishIds.includes(p.id));
        const mergedWish = [...dbWish];
        for (const g of guestWish) {
          if (!mergedWish.find(m => m.id === g.id)) mergedWish.push(g);
        }

        setCart(merged);
        setWishlist(mergedWish);
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(WISH_KEY);
        setSyncReady(true);
      });
    } else {
      // Guest — load from localStorage
      const savedCart = localStorage.getItem(CART_KEY);
      const savedWish = localStorage.getItem(WISH_KEY);
      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWish) setWishlist(JSON.parse(savedWish));
      setSyncReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId, products.length]);

  // Persist cart
  useEffect(() => {
    if (!syncReady) return;
    if (userId) {
      fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart.map(i => ({ productId: i.id, quantity: i.quantity })) }),
      });
    } else {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, userId, syncReady]);

  // Persist wishlist
  useEffect(() => {
    if (!syncReady) return;
    if (userId) {
      fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: wishlist.map(p => p.id) }),
      });
    } else {
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, userId, syncReady]);

  const newCollection = products.filter(p => p.section === 'new_collection' || p.isNew);
  const galleryProducts = products.filter(p => p.section === 'gallery' || (!p.isNew && !p.isNewProduct));

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: number) =>
    setCart(prev => prev.filter(i => i.id !== productId)), []);

  const updateQuantity = useCallback((productId: number, delta: number) =>
    setCart(prev => prev.map(i =>
      i.id === productId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    )), []);

  const toggleWishlist = useCallback((product: Product) =>
    setWishlist(prev => prev.find(i => i.id === product.id)
      ? prev.filter(i => i.id !== product.id)
      : [...prev, product]
    ), []);

  const isInWishlist = useCallback((productId: number) =>
    wishlist.some(i => i.id === productId), [wishlist]);

  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products, newCollection, galleryProducts, isLoading, error,
      cart, wishlist, addToCart, removeFromCart, updateQuantity,
      toggleWishlist, isInWishlist, isCartOpen, setIsCartOpen,
      isWishlistOpen, setIsWishlistOpen, cartTotal, cartCount,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
