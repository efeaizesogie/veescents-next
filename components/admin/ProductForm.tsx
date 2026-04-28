'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '@/types';
import Image from 'next/image';
import { Check, Upload } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface Section {
  _id: string;
  name: string;
  slug: string;
}

const MEDIA_FILES = [
  'afnan-9pm-elixir-parfum-intense-100ml.jpg',
  'afnan-rare-reef-edp-100ml.jpeg',
  'afnan-supremacy-collector-s-edition-edp-100ml.jpeg',
  'arabian-luxury-perfume.webp',
  'arabian-perfume.webp',
  'armaf-club-de-nuit-intense-edt-105ml-for-men.jpg',
  'armaf-club-de-nuit-precieux-1-edp-55ml.jpeg',
  'armaf-club-de-nuit-urban-man-edp-elixir-105ml.jpeg',
  'azzaro-the-most-wanted-parfum-100ml-for-men.jpeg',
  'body-mist.jpg',
  'body-spray.jpg',
  'carolina-herrera-212-nyc-edt-100ml-for-men.jpeg',
  'combo.webp',
  'diffuser.webp',
  'emir-a-walk-on-dirt-edp-100ml.jpeg',
  'fragrance-world-midnight-oud-edp-100ml-for-men.jpeg',
  'fragrance-world-oud-madness-edp-60ml.jpg',
  'fragrance-world-suits-edp-100ml-for-men.jpeg',
  'franck-olivier-oud-touch-edp-100ml-for-men.jpeg',
  'geoffrey-beene-grey-flannel-edt-120ml-for-men.jpg',
  'gift-set.jpeg',
  'giorgio-armani-emporio-stronger-with-you-intensely-edp-100ml.jpg',
  'gucci-intense-oud-edp-90ml-for-men.jpg',
  'joop-homme-edt-125ml-for-men.jpeg',
  'kiddies.jpg',
  'lattafa-asad-edp-100ml-for-men.jpg',
  'mancera-red-tobacco-edp-120ml-for-men.jpg',
  'musamam-black-intense-lattafa-edp-100ml.webp',
  'original-designer-perfume.jpeg',
  'perfume-oil.jpg',
  'rasasi-hawas-edp-100ml-for-men.jpg',
  'rasasi-hawas-ice-edp-100ml.jpg',
  'rayhaan-elixir-eau-de-parfum-100ml.jpeg',
  'rayhaan-pacific-aura-pour-homme-edp-100ml.jpeg',
  'salvatore-ferragamo-spicy-leather-parfum-100ml.jpg',
];

const COLLECTIONS = [
  { value: '', label: '— None —' },
  { value: 'original-designer-perfume', label: 'Original Designer Perfume' },
  { value: 'arabian-luxury-perfume', label: 'Arabian Luxury Perfume' },
  { value: 'arabian-perfume', label: 'Arabian Perfume' },
  { value: 'perfume-oil', label: 'Perfume Oil' },
  { value: 'body-spray', label: 'Body Spray' },
  { value: 'body-mist', label: 'Body Mist' },
  { value: 'perfume-gift-set', label: 'Perfume Gift Sets' },
  { value: 'diffuser', label: 'Diffuser' },
  { value: 'kiddies', label: 'Kiddies' },
  { value: 'combo', label: 'Combos' },
];

const ALL_TAGS = ['best_seller', 'recommended', 'new_arrival', 'deal'];

type FormData = Omit<Product, 'id' | 'isNew'> & { collection: string; tags: string[] };

const EMPTY: FormData = {
  name: '', brand: '', price: 0, rating: 5,
  image: '', category: 'unisex', section: 'gallery',
  isNewProduct: false, salesCount: 0, inStock: true,
  cat: undefined, collection: '', tags: [],
};

export default function ProductForm({ product }: { product?: Product & { collection?: string; tags?: string[] } }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    fetch('/api/admin/categories')
      .then(r => r.json())
      .then(data => setCategories(Array.isArray(data) ? data : []));
    fetch('/api/admin/sections')
      .then(r => r.json())
      .then(data => setSections(Array.isArray(data) ? data : []));
  }, []);

  const [form, setForm] = useState<FormData>(product ? {
    name: product.name, brand: product.brand, price: product.price,
    rating: product.rating, image: product.image, category: product.category,
    section: product.section ?? 'gallery', isNewProduct: product.isNewProduct ?? false,
    salesCount: product.salesCount ?? 0, inStock: product.inStock ?? true,
    cat: product.cat, collection: product.collection ?? '',
    tags: product.tags ?? [],
  } : EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof FormData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const toggleTag = (tag: string) =>
    set('tags', form.tags.includes(tag) ? form.tags.filter(t => t !== tag) : [...form.tags, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';
      const res = await fetch(url, {
        method: product ? 'PUT' : 'POST',
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

  const ic = 'w-full border border-gray-200 px-4 py-2.5 text-sm text-accent-dark focus:outline-none focus:border-accent-gold transition-colors bg-white rounded-sm';
  const lc = 'block text-xs uppercase tracking-widest text-gray-400 font-medium mb-2';

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {error && <p className="mb-6 text-sm text-red-500 bg-red-50 px-4 py-3 rounded-sm">{error}</p>}

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-4 md:p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div className="col-span-2">
            <label className={lc}>Product Name</label>
            <input required className={ic} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Armaf Club de Nuit" />
          </div>

          <div>
            <label className={lc}>Brand</label>
            <input required className={ic} value={form.brand} onChange={e => set('brand', e.target.value)} placeholder="e.g. Armaf" />
          </div>

          <div>
            <label className={lc}>Price (₦)</label>
            <input required type="number" min="0" className={ic} value={form.price} onChange={e => set('price', e.target.value)} />
          </div>

          <div>
            <label className={lc}>Gender Category</label>
            <select className={ic} value={form.category} onChange={e => set('category', e.target.value)}>
              {categories.length === 0 ? (
                <option value="">Loading...</option>
              ) : (
                categories.map(c => (
                  <option key={c._id} value={c.slug}>{c.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className={lc}>Section</label>
            <select className={ic} value={form.section} onChange={e => set('section', e.target.value)}>
              {sections.length === 0 ? (
                <option value="">Loading...</option>
              ) : (
                sections.map(s => (
                  <option key={s._id} value={s.slug}>{s.name}</option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className={lc}>Collection</label>
            <select className={ic} value={form.collection} onChange={e => set('collection', e.target.value)}>
              {COLLECTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label className={lc}>Product Type</label>
            <select className={ic} value={form.cat ?? ''} onChange={e => set('cat', e.target.value || undefined)}>
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
            <label className={lc}>Rating (1–5)</label>
            <input required type="number" min="1" max="5" className={ic} value={form.rating} onChange={e => set('rating', e.target.value)} />
          </div>

          <div>
            <label className={lc}>Sales Count</label>
            <input type="number" min="0" className={ic} value={form.salesCount ?? 0} onChange={e => set('salesCount', Number(e.target.value))} />
          </div>

          {/* Tags */}
          <div className="col-span-2">
            <label className={lc}>Tags</label>
            <div className="flex flex-wrap gap-3">
              {ALL_TAGS.map(tag => (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-widest rounded-sm border transition-colors ${form.tags.includes(tag) ? 'bg-accent-gold border-accent-gold text-white' : 'border-gray-200 text-gray-500 hover:border-accent-gold hover:text-accent-gold'}`}>
                  {tag.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center gap-3">
            <input type="checkbox" id="inStock" checked={form.inStock ?? true} onChange={e => set('inStock', e.target.checked)} className="accent-accent-gold w-4 h-4" />
            <label htmlFor="inStock" className="text-sm text-gray-500">In Stock</label>
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="isNew" checked={form.isNewProduct} onChange={e => set('isNewProduct', e.target.checked)} className="accent-accent-gold w-4 h-4" />
            <label htmlFor="isNew" className="text-sm text-gray-500">New Arrival</label>
          </div>

          {/* Image */}
          <div className="col-span-2">
            <label className={lc}>Product Image</label>

            {/* Upload new file */}
            <label className="flex items-center gap-2 cursor-pointer mb-3 w-fit border border-dashed border-gray-300 hover:border-accent-gold px-4 py-2 rounded-sm text-sm text-gray-500 hover:text-accent-gold transition-colors">
              <Upload size={14} />
              Upload new image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
                  if (res.ok) {
                    const { path } = await res.json();
                    set('image', path);
                  }
                }}
              />
            </label>

            {/* Media picker grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-52 overflow-y-auto border border-gray-100 rounded-sm p-2 bg-gray-50">
              {MEDIA_FILES.map((file) => {
                const path = `/products/${file}`;
                const selected = form.image === path;
                return (
                  <button
                    key={file}
                    type="button"
                    onClick={() => set('image', path)}
                    className={`relative aspect-square rounded-sm overflow-hidden border-2 transition-colors ${
                      selected ? 'border-accent-gold' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image src={path} alt={file} fill className="object-cover" sizes="80px" />
                    {selected && (
                      <div className="absolute inset-0 bg-accent-gold/20 flex items-center justify-center">
                        <Check size={16} className="text-accent-gold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {form.image && (
              <p className="mt-2 text-xs text-gray-400 truncate">Selected: {form.image}</p>
            )}
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="submit" disabled={loading}
          className="bg-accent-gold text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:border-accent-dark transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
