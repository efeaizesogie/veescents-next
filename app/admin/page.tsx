import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Collection from '@/lib/models/Collection';
import Link from 'next/link';
import { Package, Layers, Tag, Plus, TrendingUp, Star, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getStats() {
  await connectDB();
  const [total, newArrivals, bestSellers, recommended, collections, brands] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ isNewProduct: true }),
    Product.countDocuments({ tags: 'best_seller' }),
    Product.countDocuments({ tags: 'recommended' }),
    Collection.countDocuments(),
    Product.distinct('brand'),
  ]);
  const topSellers = await Product.find({ tags: 'best_seller' }).sort({ salesCount: -1 }).limit(5).lean();
  return { total, newArrivals, bestSellers, recommended, collections, brands: brands.length, topSellers };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { label: 'Total Products', value: stats.total, icon: Package, href: '/admin/products', color: 'text-accent-gold' },
    { label: 'Collections', value: stats.collections, icon: Layers, href: '/admin/collections', color: 'text-blue-400' },
    { label: 'Best Sellers', value: stats.bestSellers, icon: TrendingUp, href: '/admin/products', color: 'text-green-400' },
    { label: 'New Arrivals', value: stats.newArrivals, icon: Sparkles, href: '/admin/products', color: 'text-purple-400' },
    { label: 'Recommended', value: stats.recommended, icon: Star, href: '/admin/products', color: 'text-yellow-400' },
    { label: 'Brands', value: stats.brands, icon: Tag, href: '/admin/products', color: 'text-pink-400' },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl text-accent-dark">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Welcome back — here&apos;s your store overview</p>
        </div>
        <Link href="/admin/products/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors w-fit">
          <Plus size={16} /> Add Product
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href}
            className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:border-accent-gold transition-colors group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-widest text-gray-400 font-medium">{label}</span>
              <Icon size={18} className={`${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
            </div>
            <p className="font-serif text-4xl text-accent-dark">{value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top selling products */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-accent-dark mb-5">Top Best Sellers</h2>
          <div className="space-y-3">
            {(stats.topSellers as any[]).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-300 w-4">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-accent-dark line-clamp-1">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.brand}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-accent-gold">₦{p.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{p.salesCount} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6">
          <h2 className="font-serif text-xl text-accent-dark mb-5">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Product', href: '/admin/products/new', icon: Package },
              { label: 'Add Collection', href: '/admin/collections/new', icon: Layers },
              { label: 'View Products', href: '/admin/products', icon: Tag },
              { label: 'View Collections', href: '/admin/collections', icon: Layers },
              { label: 'Categories', href: '/admin/categories', icon: Tag },
              { label: 'Settings', href: '/admin/settings', icon: Tag },
            ].map(({ label, href, icon: Icon }) => (
              <Link key={label} href={href}
                className="flex items-center gap-2 border border-gray-200 px-4 py-3 text-sm hover:border-accent-gold hover:text-accent-gold transition-colors text-gray-600">
                <Icon size={14} /> {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
