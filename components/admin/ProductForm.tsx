'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import Image from 'next/image';

type FormData = Omit<Product, 'id' | 'isNew'>;

const EMPTY: FormData = {
  name: '', brand: '', price: 0, rating: 5,
  image: '', category: 'unisex', section: 'gallery',
  isNewProduct: false, salesCount: 0, inStock: true, cat: undefined,
};

export default function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(product ? {
    name: product.name, brand: product.brand, price: product.price,
    rating: product.rating, image: product.image, category: product.category,
    section: product.section ?? 'gallery', isNewProduct: product.isNewProduct ?? false,
    salesCount: product.salesCount ?? 0, inStock: product.inStock ?? true, cat: product.cat,
  } : EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const method = product ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), rating: Number(form.rating) }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'w-full border border-gray-200 px-4 py-2.5 text-sm text-accent-dark focus:outline-none focus:border-accent-gold transition-colors bg-white rounded-sm';
  const labelClass = 'block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && <p className="mb-6 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-sm">{error}</p>}

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="col-span-2">
            <label className={labelClass}>Product Name</label>
            <input required className={inputClass} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Noir Élégance" />
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input required className={inputClass} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Chanel" />
          </div>
          <div>
            <label className={labelClass}>Price (USD)</label>
            <input required type="number" min="0" step="0.01" className={inputClass} value={form.price} onChange={e => set('price', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Section</label>
            <select className={inputClass} value={form.section} onChange={e => set('section', e.target.value)}>
              <option value="new_collection">New Collection</option>
              <option value="gallery">Gallery</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Rating (1–5)</label>
            <input required type="number" min="1" max="5" className={inputClass} value={form.rating} onChange={e => set('rating', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Product Type (cat)</label>
            <select className={inputClass} value={form.cat ?? ''} onChange={e => set('cat', e.target.value || undefined)}>
              <option value="">— None —</option>
              <option value="niche">Niche Perfume</option>
              <option value="perfume_oil">Perfume Oil</option>
              <option value="gift_set">Gift Set</option>
              <option value="combo">Combo</option>
              <option value="celebrity">Celebrity</option>
              <option value="body_care">Body & Beauty</option>
              <option value="candles">Scented Candles</option>
              <option value="deodorants">Deodorants</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Sales Count</label>
            <input type="number" min="0" className={inputClass} value={form.salesCount ?? 0} onChange={e => set('salesCount', Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="inStock" checked={form.inStock ?? true} onChange={e => set('inStock', e.target.checked)} className="accent-accent-gold w-4 h-4" />
            <label htmlFor="inStock" className="text-sm text-gray-500">In Stock</label>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <input type="checkbox" id="isNew" checked={form.isNewProduct} onChange={e => set('isNewProduct', e.target.checked)} className="accent-accent-gold w-4 h-4" />
            <label htmlFor="isNew" className="text-sm text-gray-500">Mark as New Arrival</label>
          </div>
          <div className="col-span-2">
            <label className={labelClass}>Image URL</label>
            <input required className={inputClass} value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://images.unsplash.com/..." />
            {form.image && (
              <div className="mt-3 relative w-24 h-24 bg-gray-100 rounded-sm overflow-hidden">
                <Image src={form.image} alt="preview" fill className="object-cover" sizes="96px" onError={() => {}} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={loading}
          className="bg-accent-gold text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()} className="border border-gray-200 px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:border-accent-dark transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
