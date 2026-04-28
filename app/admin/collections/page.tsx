import { connectDB } from '@/lib/mongodb';
import Collection from '@/lib/models/Collection';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import DeleteCollectionButton from '@/components/admin/DeleteCollectionButton';

async function getCollections() {
  await connectDB();
  return Collection.find().sort({ order: 1 }).lean();
}

export default async function AdminCollectionsPage() {
  const collections = await getCollections();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-accent-dark">Collections</h1>
          <p className="text-gray-400 text-sm mt-1">{collections.length} collections</p>
        </div>
        <Link href="/admin/collections/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors">
          <Plus size={16} /> Add Collection
        </Link>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr className="text-xs uppercase tracking-widest text-gray-400">
              <th className="text-left px-6 py-4">Collection</th>
              <th className="text-left px-6 py-4 hidden md:table-cell">Slug</th>
              <th className="text-left px-6 py-4 hidden md:table-cell">Order</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {(collections as any[]).map((col) => (
              <tr key={col.slug} className="hover:bg-cream-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={col.image} alt={col.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-medium text-accent-dark">{col.name}</p>
                      <p className="text-xs text-gray-400 line-clamp-1">{col.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">{col.slug}</code>
                </td>
                <td className="px-6 py-4 hidden md:table-cell text-gray-500">{col.order}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/collections/${col.slug}`} className="p-2 hover:text-accent-gold transition-colors text-gray-400">
                      <Pencil size={16} />
                    </Link>
                    <DeleteCollectionButton slug={col.slug} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
