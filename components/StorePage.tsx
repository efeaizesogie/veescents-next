'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';
import ProductCard from './ProductCard';
import SectionTitle from './SectionTitle';

const EXCHANGE_RATE = 1;
const MAX_PRICE = 200000;

const CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
  { value: 'unisex', label: 'Unisex' },
];

const CAT_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'niche', label: 'Niche Perfumes' },
  { value: 'perfume_oil', label: 'Perfume Oils' },
  { value: 'gift_set', label: 'Gift Sets' },
  { value: 'combo', label: 'Combos' },
  { value: 'celebrity', label: 'Celebrity' },
  { value: 'body_care', label: 'Body & Beauty' },
  { value: 'candles', label: 'Scented Candles' },
  { value: 'deodorants', label: 'Deodorants' },
];

const SECTIONS: { value: string; label: string }[] = [];

const BUDGET_PRESETS = [
  { label: 'Under ₦15k', max: 15000 },
  { label: 'Under ₦25k', max: 25000 },
  { label: 'Under ₦35k', max: 35000 },
  { label: 'Under ₦50k', max: 50000 },
  { label: 'Under ₦100k', max: 100000 },
];

const RATINGS = [5, 4, 3, 2, 1];

function StarRow({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-3 h-3 ${i < rating ? 'text-accent-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-5">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between mb-3 group"
      >
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-accent-gold transition-colors">{title}</p>
        {open ? <ChevronUp size={13} className="text-gray-300" /> : <ChevronDown size={13} className="text-gray-300" />}
      </button>
      {open && children}
    </div>
  );
}

export default function StorePage() {
  const searchParams = useSearchParams();
  const { products } = useStore();
  const [dbSections, setDbSections] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    fetch('/api/admin/sections')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data))
          setDbSections([{ value: 'all', label: 'All' }, ...data.map((s: any) => ({ value: s.slug, label: s.name }))]);
      });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'all');
  const [activeCat, setActiveCat] = useState(searchParams.get('cat') || 'all');
  const [activeSection, setActiveSection] = useState(searchParams.get('section') || 'all');
  const [activeCollection, setActiveCollection] = useState(searchParams.get('collection') || 'all');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'default');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [budgetPreset, setBudgetPreset] = useState<number | null>(null);
  const [newOnly, setNewOnly] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [activeBrands, setActiveBrands] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const uniqueProducts = Array.from(new Map<number, Product>(products.map(p => [p.id, p])).values());

  const allBrands = useMemo(() =>
    [...new Set(uniqueProducts.map(p => p.brand))].sort(),
    [uniqueProducts]
  );

  const effectiveMaxPrice = budgetPreset ?? priceRange[1];
  const effectiveMinPrice = budgetPreset ? 0 : priceRange[0];

  const filteredProducts = useMemo(() => {
    let result = uniqueProducts;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lower) || p.brand.toLowerCase().includes(lower));
    }
    if (activeCategory !== 'all') result = result.filter(p => p.category === activeCategory);
    if (activeCat !== 'all') result = result.filter(p => p.cat === activeCat);
    if (activeSection !== 'all') result = result.filter(p => p.section === activeSection);
    if (activeCollection !== 'all') result = result.filter(p => (p as any).collectionSlug === activeCollection || (p as any).collection === activeCollection);
    if (minRating > 0) result = result.filter(p => p.rating >= minRating);
    if (newOnly) result = result.filter(p => p.isNew || p.isNewProduct);
    if (inStockOnly) result = result.filter(p => p.inStock !== false);
    if (activeBrands.length > 0) result = result.filter(p => activeBrands.includes(p.brand));
    result = result.filter(p => p.price >= effectiveMinPrice && p.price <= effectiveMaxPrice);
    const res = [...result];
    if (sortOption === 'price-asc') res.sort((a, b) => a.price - b.price);
    else if (sortOption === 'price-desc') res.sort((a, b) => b.price - a.price);
    else if (sortOption === 'rating') res.sort((a, b) => b.rating - a.rating);
    else if (sortOption === 'newest') res.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
    else if (sortOption === 'best_selling') res.sort((a, b) => (b.salesCount ?? 0) - (a.salesCount ?? 0));
    return res;
  }, [uniqueProducts, searchTerm, activeCategory, activeCat, activeSection, activeCollection, sortOption, minRating, newOnly, inStockOnly, activeBrands, effectiveMinPrice, effectiveMaxPrice]);

  const activeFilterCount = [
    activeCategory !== 'all',
    activeCat !== 'all',
    activeSection !== 'all',
    activeCollection !== 'all',
    minRating > 0,
    newOnly,
    inStockOnly,
    activeBrands.length > 0,
    budgetPreset !== null || priceRange[0] > 0 || priceRange[1] < MAX_PRICE,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setActiveCategory('all');
    setActiveCat('all');
    setActiveSection('all');
    setActiveCollection('all');
    setMinRating(0);
    setPriceRange([0, MAX_PRICE]);
    setBudgetPreset(null);
    setNewOnly(false);
    setInStockOnly(false);
    setActiveBrands([]);
  };

  const toggleBrand = (brand: string) =>
    setActiveBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]);

  const SidebarContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-lg text-accent-dark">Filters</h3>
        {activeFilterCount > 0 && (
          <button onClick={resetFilters} className="text-xs text-accent-gold hover:underline flex items-center gap-1">
            <X size={11} /> Clear ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Quick toggles */}
      <FilterSection title="Quick Filters">
        <div className="space-y-2">
          {[
            { label: 'New Arrivals', value: newOnly, set: setNewOnly },
            { label: 'In Stock', value: inStockOnly, set: setInStockOnly },
          ].map(({ label, value, set }) => (
            <label key={label} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => set(!value)}
                className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${value ? 'bg-accent-gold border-accent-gold' : 'border-gray-300 group-hover:border-accent-gold'}`}
              >
                {value && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-sm text-gray-600">{label}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* Category */}
      <FilterSection title="Gender">
        <div className="space-y-1">
          {CATEGORIES.map(cat => (
            <button key={cat.value} onClick={() => setActiveCategory(cat.value)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors flex items-center justify-between ${activeCategory === cat.value ? 'bg-accent-dark text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
              {cat.label}
              {activeCategory === cat.value && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Product Type */}
      <FilterSection title="Product Type">
        <div className="space-y-1">
          {CAT_TYPES.map(c => (
            <button key={c.value} onClick={() => setActiveCat(c.value)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors flex items-center justify-between ${activeCat === c.value ? 'bg-accent-dark text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
              {c.label}
              {activeCat === c.value && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Section */}
      <FilterSection title="Section" defaultOpen={false}>
        <div className="space-y-1">
          {dbSections.map(sec => (
            <button key={sec.value} onClick={() => setActiveSection(sec.value)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors ${activeSection === sec.value ? 'bg-accent-dark text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
              {sec.label}
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Budget Presets */}
      <FilterSection title="Budget">
        <div className="space-y-1 mb-3">
          {BUDGET_PRESETS.map(({ label, max }) => (
            <button key={max} onClick={() => setBudgetPreset(budgetPreset === max ? null : max)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors flex items-center justify-between ${budgetPreset === max ? 'bg-accent-gold text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
              {label}
              {budgetPreset === max && <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
            </button>
          ))}
        </div>
        {!budgetPreset && (
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Custom Range</p>
            <div className="flex justify-between text-xs text-gray-500">
              <span>₦{priceRange[0].toLocaleString()}</span>
              <span>₦{priceRange[1].toLocaleString()}</span>
            </div>
            <input type="range" min={0} max={MAX_PRICE} step={5000}
              value={priceRange[0]}
              onChange={e => setPriceRange([Number(e.target.value), priceRange[1]])}
              className="w-full accent-accent-gold h-1" />
            <input type="range" min={0} max={MAX_PRICE} step={5000}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
              className="w-full accent-accent-gold h-1" />
          </div>
        )}
      </FilterSection>

      {/* Rating */}
      <FilterSection title="Min Rating" defaultOpen={false}>
        <div className="space-y-1">
          <button onClick={() => setMinRating(0)}
            className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors ${minRating === 0 ? 'bg-accent-dark text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
            Any Rating
          </button>
          {RATINGS.map(r => (
            <button key={r} onClick={() => setMinRating(r)}
              className={`w-full text-left text-sm px-3 py-1.5 rounded-sm transition-colors flex items-center gap-2 ${minRating === r ? 'bg-accent-dark text-white' : 'text-gray-600 hover:bg-cream-100'}`}>
              <StarRow rating={r} />
              <span className="text-xs">& up</span>
            </button>
          ))}
        </div>
      </FilterSection>

      {/* Brand */}
      {allBrands.length > 0 && (
        <FilterSection title="Brand" defaultOpen={false}>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {allBrands.map(brand => (
              <label key={brand} className="flex items-center gap-2.5 cursor-pointer group">
                <div onClick={() => toggleBrand(brand)}
                  className={`w-4 h-4 rounded-sm border flex-shrink-0 flex items-center justify-center transition-colors ${activeBrands.includes(brand) ? 'bg-accent-gold border-accent-gold' : 'border-gray-300 group-hover:border-accent-gold'}`}>
                  {activeBrands.includes(brand) && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm text-gray-600 truncate">{brand}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}
    </div>
  );

  return (
    <div className="pt-32 pb-20 bg-cream-50 min-h-screen">
      <div className="container mx-auto px-6">
        <SectionTitle title="Our Collection" subtitle="Luxury fragrance for every budget." />

        {/* Top bar */}
        <div className="bg-white p-4 shadow-sm rounded-sm mb-8 flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              className="lg:hidden flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-dark border border-gray-200 px-3 py-2 rounded-sm hover:border-accent-gold transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <SlidersHorizontal size={14} /> Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-accent-gold text-white text-[9px] flex items-center justify-center font-bold">{activeFilterCount}</span>
              )}
            </button>
            <div className="relative flex-1 sm:flex-none">
              <input type="text" placeholder="Search by name or brand..."
                value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-accent-dark w-full sm:w-72 text-sm" />
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X size={13} />
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs text-gray-400">{filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}</span>
            <select value={sortOption} onChange={e => setSortOption(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-accent-dark bg-white text-sm">
              <option value="default">Sort: Default</option>
              <option value="newest">New Arrivals</option>
              <option value="rating">Best Rated</option>
              <option value="best_selling">Best Selling</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8 items-start">
          {/* Desktop sticky scrollable sidebar */}
          <div className="hidden lg:block w-60 flex-shrink-0 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto rounded-sm">
            <div className="bg-white p-5 shadow-sm rounded-sm">
              <SidebarContent />
            </div>
          </div>

          {/* Mobile sidebar overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <div className="absolute left-0 top-0 h-full w-72 bg-white overflow-y-auto shadow-xl">
                <div className="p-5 pt-14">
                  <button className="absolute top-4 right-4 text-gray-400 hover:text-accent-dark" onClick={() => setSidebarOpen(false)}>
                    <X size={20} />
                  </button>
                  <SidebarContent />
                </div>
              </div>
            </div>
          )}

          {/* Product grid — scrolls independently */}
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <div key={p.id} className="animate-fade-in">
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-24 text-gray-400">
                  <p className="font-serif text-2xl mb-2">No products found</p>
                  <p className="text-sm mb-4">Try adjusting your filters.</p>
                  <button onClick={resetFilters} className="text-xs font-bold uppercase tracking-widest text-accent-gold hover:underline">
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
