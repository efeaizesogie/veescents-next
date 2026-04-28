'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CollectionData {
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

const EMPTY: CollectionData = { name: '', slug: '', description: '', image: '', order: 0 };

export default function CollectionForm({ collection }: { collection?: CollectionData & { _id?: string } }) {
  const router = useRouter();
  const [form, setForm] = useState<CollectionData>(collection ?? EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (field: keyof CollectionData, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const url = collection ? `/api/admin/collections/${collection.slug}` : '/api/admin/collections';
      const res = await fetch(url, {
        method: collection ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, order: Number(form.order) }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      router.push('/admin/collections');
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

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">

          <div className="col-span-2">
            <label className={lc}>Collection Name</label>
            <input required className={ic} value={form.name}
              onChange={e => { set('name', e.target.value); if (!collection) set('slug', autoSlug(e.target.value)); }}
              placeholder="e.g. Arabian Luxury Perfume" />
          </div>

          <div className="col-span-2">
            <label className={lc}>Slug (URL key)</label>
            <input required className={ic} value={form.slug} onChange={e => set('slug', e.target.value)}
              placeholder="e.g. arabian-luxury-perfume" />
            <p className="text-xs text-gray-400 mt-1">Used in URLs: /store?collection=<strong>{form.slug || 'slug'}</strong></p>
          </div>

          <div className="col-span-2">
            <label className={lc}>Description</label>
            <textarea rows={3} className={ic} value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Short description of this collection..." />
          </div>

          <div>
            <label className={lc}>Display Order</label>
            <input type="number" min="0" className={ic} value={form.order} onChange={e => set('order', e.target.value)} />
          </div>

          <div className="col-span-2">
            <label className={lc}>Image Path or URL</label>
            <input required className={ic} value={form.image} onChange={e => set('image', e.target.value)}
              placeholder="/products/arabian-luxury-perfume.webp" />
            {form.image && (
              <div className="mt-3 relative w-32 h-24 bg-gray-100 rounded-sm overflow-hidden">
                <Image src={form.image} alt="preview" fill className="object-cover" sizes="128px" />
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button type="submit" disabled={loading}
          className="bg-accent-gold text-white px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : collection ? 'Update Collection' : 'Create Collection'}
        </button>
        <button type="button" onClick={() => router.back()}
          className="border border-gray-200 px-8 py-2.5 text-sm font-bold uppercase tracking-widest hover:border-accent-dark transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
