'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Check, Loader2 } from 'lucide-react';
import Image from 'next/image';
import ImagePickerField from '@/components/admin/ImagePickerField';

interface Section {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  order: number;
}

const EMPTY = { name: '', description: '', image: '', order: 0 };

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/sections', { cache: 'no-store' });
    const data = await res.json();
    setSections(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openNew = () => { setForm(EMPTY); setEditing('new'); setError(''); };
  const openEdit = (s: Section) => { setForm({ name: s.name, description: s.description || '', image: s.image || '', order: s.order }); setEditing(s._id); setError(''); };
  const cancel = () => { setEditing(null); setError(''); };

  const save = async () => {
    if (!form.name.trim()) { setError('Name is required'); return; }
    setSaving(true); setError('');
    try {
      const isNew = editing === 'new';
      const res = await fetch(
        isNew ? '/api/admin/sections' : `/api/admin/sections/${editing}`,
        { method: isNew ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) }
      );
      if (!res.ok) throw new Error((await res.json()).message);
      await load();
      setEditing(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this section?')) return;
    await fetch(`/api/admin/sections/${id}`, { method: 'DELETE' });
    setSections(prev => prev.filter(s => s._id !== id));
  };

  const ic = 'w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-accent-gold transition-colors bg-white rounded-sm';

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark">Sections</h1>
          <p className="text-gray-400 text-sm mt-1">{sections.length} sections</p>
        </div>
        <button onClick={openNew}
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors w-fit">
          <Plus size={16} /> Add Section
        </button>
      </div>

      {editing !== null && (
        <div className="bg-white border border-accent-gold/30 rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
            {editing === 'new' ? 'New Section' : 'Edit Section'}
          </h2>
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Name *</label>
              <input className={ic} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Featured" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Description</label>
              <input className={ic} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-1">Order</label>
              <input type="number" className={ic} value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
          </div>
          <div className="mb-4">
            <ImagePickerField value={form.image} onChange={(value) => setForm(f => ({ ...f, image: value }))} />
          </div>
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
              className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors disabled:opacity-50">
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={cancel}
              className="flex items-center gap-2 border border-gray-200 px-5 py-2 text-sm font-bold uppercase tracking-widest hover:border-accent-dark transition-colors">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400">
            <Loader2 size={20} className="animate-spin mr-2" /> Loading...
          </div>
        ) : sections.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-serif text-xl mb-2">No sections yet</p>
            <p className="text-sm">Click &quot;Add Section&quot; to create your first one.</p>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[400px]">
            <thead className="border-b border-gray-100">
              <tr className="text-xs uppercase tracking-widest text-gray-400">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Image</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Slug</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Description</th>
                <th className="text-left px-6 py-4 hidden sm:table-cell">Order</th>
                <th className="text-right px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sections.map(s => (
                <tr key={s._id} className={`hover:bg-cream-50 transition-colors ${editing === s._id ? 'bg-accent-gold/5' : ''}`}>
                  <td className="px-6 py-4 font-medium text-accent-dark">{s.name}</td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-sm overflow-hidden">
                      {s.image ? (
                        <Image src={s.image} alt={s.name} fill className="object-cover" sizes="48px" />
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{s.slug}</code>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell text-gray-400 text-xs">{s.description || '—'}</td>
                  <td className="px-6 py-4 hidden sm:table-cell text-gray-500">{s.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} className="p-2 hover:text-accent-gold transition-colors text-gray-400">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(s._id)} className="p-2 hover:text-red-500 transition-colors text-gray-400">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
