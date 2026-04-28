import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Link from 'next/link';
import { Package, Tag, Plus } from 'lucide-react';

async function getStats() {
  await connectDB();
  const total = await Product.countDocuments();
  const newCollection = await Product.countDocuments({ section: 'new_collection' });
  const gallery = await Product.countDocuments({ section: 'gallery' });
  const categories = await Product.distinct('category');
  return { total, newCollection, gallery, categories: categories.length };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Products', value: stats.total, icon: Package, href: '/admin/products' },
    { label: 'New Collection', value: stats.newCollection, icon: Package, href: '/admin/products' },
    { label: 'Gallery Products', value: stats.gallery, icon: Package, href: '/admin/products' },
    { label: 'Categories', value: stats.categories, icon: Tag, href: '/admin/categories' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-accent-dark">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your store</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={label} href={href} className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:border-accent-gold transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{label}</span>
              <Icon size={18} className="text-gray-300 group-hover:text-accent-gold transition-colors" />
            </div>
            <p className="font-serif text-4xl text-accent-dark">{value}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
        <h2 className="font-serif text-xl text-accent-dark mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link href="/admin/products/new" className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm hover:border-accent-gold hover:text-accent-gold transition-colors">
            <Plus size={14} /> New Product
          </Link>
          <Link href="/admin/categories" className="flex items-center gap-2 border border-gray-200 px-4 py-2 text-sm hover:border-accent-gold hover:text-accent-gold transition-colors">
            <Tag size={14} /> Manage Categories
          </Link>
        </div>
      </div>
    </div>
  );
}
