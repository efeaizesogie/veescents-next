'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useUser } from '@clerk/nextjs';
import { Product, CartItem } from '@/types';

interface StoreContextType {
  products: Product[];
  newCollection: Product[];
  galleryProducts: Product[];
  bestSellers: Product[];
  recommended: Product[];
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
  recentlyViewedIds: number[];
  recentSearches: string[];
  trackProductView: (productId: number) => void;
  trackSearch: (term: string) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const CART_KEY = 'veescents_cart';
const WISH_KEY = 'veescents_wishlist';
const REC_KEY = 'veescents_reco_signals';

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
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Fetch products from DB
  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  // Reset syncReady when user status changes to prevent race condition updates
  useEffect(() => {
    setSyncReady(false);
  }, [userId]);

  // Load cart + wishlist once auth and products are resolved
  useEffect(() => {
    if (!isLoaded || isLoading) return;

    if (userId) {
      console.log('[StoreContext] Fetching cart and wishlist from DB for user', userId);
      // Logged in — load from DB
      Promise.all([
        fetch('/api/user/cart').then(r => {
          if (!r.ok) throw new Error(`Cart retrieval HTTP error ${r.status}`);
          return r.json();
        }),
        fetch('/api/user/wishlist').then(r => {
          if (!r.ok) throw new Error(`Wishlist retrieval HTTP error ${r.status}`);
          return r.json();
        }),
      ]).then(([cartData, wishData]) => {
        console.log('[StoreContext] Successfully loaded from DB:', { cartData, wishData });
        
        // Merge guest localStorage cart into DB cart
        const guestCart: CartItem[] = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
        const guestWish: Product[] = JSON.parse(localStorage.getItem(WISH_KEY) || '[]');

        console.log('[StoreContext] Merging guest items:', { guestCart, guestWish });

        const dbItems: CartItem[] = (cartData.items || []).map((i: { productId: number; quantity: number }) => {
          const p = products.find(x => x.id === i.productId);
          return p ? { ...p, quantity: i.quantity } : null;
        }).filter(Boolean);

        // Merge: guest items combined with DB cart (sum quantities for duplicates)
        const merged = [...dbItems];
        for (const g of guestCart) {
          const existing = merged.find(m => m.id === g.id);
          if (existing) {
            existing.quantity = existing.quantity + g.quantity;
          } else {
            merged.push(g);
          }
        }

        const dbWishIds: number[] = wishData.productIds || [];
        const dbWish = products.filter(p => dbWishIds.includes(p.id));
        const mergedWish = [...dbWish];
        for (const g of guestWish) {
          if (!mergedWish.find(m => m.id === g.id)) mergedWish.push(g);
        }

        console.log('[StoreContext] Merged results to set state:', { merged, mergedWish });

        setCart(merged);
        setWishlist(mergedWish);
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(WISH_KEY);
        setSyncReady(true);
      }).catch(err => {
        console.error('[StoreContext] Error merging cart/wishlist databases:', err);
        // Fallback to guest localStorage items to prevent page freezes
        try {
          const savedCart = localStorage.getItem(CART_KEY);
          const savedWish = localStorage.getItem(WISH_KEY);
          if (savedCart) setCart(JSON.parse(savedCart));
          if (savedWish) setWishlist(JSON.parse(savedWish));
        } catch (e) {
          console.error('[StoreContext] LocalStorage recovery failed:', e);
        }
        setSyncReady(true);
      });
    } else {
      // Guest — load from localStorage
      console.log('[StoreContext] Loading cart & wishlist from localStorage session for guest user');
      const savedCart = localStorage.getItem(CART_KEY);
      const savedWish = localStorage.getItem(WISH_KEY);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedWish) {
        try {
          setWishlist(JSON.parse(savedWish));
        } catch (e) {
          console.error(e);
        }
      }
      setSyncReady(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId, isLoading, products.length]);

  useEffect(() => {
    const raw = localStorage.getItem(REC_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { viewed?: number[]; searches?: string[] };
      setRecentlyViewedIds(Array.isArray(parsed.viewed) ? parsed.viewed.slice(0, 24) : []);
      setRecentSearches(Array.isArray(parsed.searches) ? parsed.searches.slice(0, 20) : []);
    } catch {
      setRecentlyViewedIds([]);
      setRecentSearches([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(REC_KEY, JSON.stringify({ viewed: recentlyViewedIds, searches: recentSearches }));
  }, [recentlyViewedIds, recentSearches]);

  // Persist cart
  useEffect(() => {
    if (!syncReady) return;
    if (userId) {
      const itemsToSync = cart.map(i => ({ productId: i.id, quantity: i.quantity }));
      console.log('[StoreContext] Syncing cart to DB:', itemsToSync);
      fetch('/api/user/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: itemsToSync }),
      }).then(res => {
        if (!res.ok) console.error('[StoreContext] DB cart sync failed status:', res.status);
      }).catch(err => {
        console.error('[StoreContext] DB cart sync network error:', err);
      });
    } else {
      console.log('[StoreContext] Saving cart to localStorage session:', cart);
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }
  }, [cart, userId, syncReady]);

  // Persist wishlist
  useEffect(() => {
    if (!syncReady) return;
    if (userId) {
      const prodIds = wishlist.map(p => p.id);
      console.log('[StoreContext] Syncing wishlist to DB:', prodIds);
      fetch('/api/user/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productIds: prodIds }),
      }).then(res => {
        if (!res.ok) console.error('[StoreContext] DB wishlist sync failed status:', res.status);
      }).catch(err => {
        console.error('[StoreContext] DB wishlist sync network error:', err);
      });
    } else {
      console.log('[StoreContext] Saving wishlist to localStorage session:', wishlist);
      localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    }
  }, [wishlist, userId, syncReady]);

  const newCollection = products.filter(p => p.section === 'new_collection' || p.isNew || p.isNewProduct);
  const galleryProducts = products.filter(p => p.section === 'gallery');
  const bestSellers = products.filter(p => (p as any).tags?.includes('best_seller')).sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
  const recommended = products.filter(p => (p as any).tags?.includes('recommended'));

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

  const trackProductView = useCallback((productId: number) => {
    setRecentlyViewedIds(prev => [productId, ...prev.filter(id => id !== productId)].slice(0, 24));
  }, []);

  const trackSearch = useCallback((term: string) => {
    const normalized = term.trim().toLowerCase();
    if (normalized.length < 2) return;
    setRecentSearches(prev => [normalized, ...prev.filter(t => t !== normalized)].slice(0, 20));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartTotal = cart.reduce((t, i) => t + i.price * i.quantity, 0);
  const cartCount = cart.reduce((t, i) => t + i.quantity, 0);

  return (
    <StoreContext.Provider value={{
      products, newCollection, galleryProducts, bestSellers, recommended, isLoading, error,
      cart, wishlist, addToCart, removeFromCart, updateQuantity,
      toggleWishlist, isInWishlist, isCartOpen, setIsCartOpen,
      isWishlistOpen, setIsWishlistOpen, cartTotal, cartCount,
      recentlyViewedIds, recentSearches, trackProductView, trackSearch,
      clearCart,
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
