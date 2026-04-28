import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Link from 'next/link';
import { Plus } from 'lucide-react';

async function getCategoryStats() {
  await connectDB();
  const categories = ['men', 'women', 'unisex'] as const;
  return Promise.all(
    categories.map(async (cat) => ({
      name: cat,
      total: await Product.countDocuments({ category: cat }),
      newCollection: await Product.countDocuments({ category: cat, section: 'new_collection' }),
      gallery: await Product.countDocuments({ category: cat, section: 'gallery' }),
    }))
  );
}

export default async function AdminCategoriesPage() {
  const stats = await getCategoryStats();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-accent-dark">Categories</h1>
          <p className="text-gray-400 text-sm mt-1">Overview of product categories</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map(({ name, total, newCollection, gallery }) => (
          <div key={name} className="bg-white rounded-sm shadow-sm border border-gray-100 p-8">
            <h2 className="font-serif text-2xl text-accent-dark capitalize mb-1">{name}</h2>
            <p className="text-4xl font-serif text-accent-gold mb-6">{total}</p>
            <div className="space-y-2 text-sm text-gray-500 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span>New Collection</span>
                <span className="font-medium text-accent-dark">{newCollection}</span>
              </div>
              <div className="flex justify-between">
                <span>Gallery</span>
                <span className="font-medium text-accent-dark">{gallery}</span>
              </div>
            </div>
            <Link
              href={`/admin/products?category=${name}`}
              className="mt-6 block text-center border border-gray-200 py-2 text-xs uppercase tracking-widest font-bold hover:border-accent-gold hover:text-accent-gold transition-colors"
            >
              View Products
            </Link>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
        <p className="text-sm text-gray-400">
          Categories are defined by the product&apos;s category field. To add a new category type, update the product schema and add products with the new category value.
        </p>
      </div>
    </div>
  );
}
