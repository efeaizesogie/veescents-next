import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, Pencil } from 'lucide-react';
import DeleteProductButton from '@/components/admin/DeleteProductButton';

async function getProducts() {
  await connectDB();
  return Product.find().sort({ id: -1 }).lean();
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-serif text-4xl text-accent-dark">Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-accent-gold text-white px-5 py-2.5 text-sm font-bold uppercase tracking-widest hover:bg-accent-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100">
            <tr className="text-xs uppercase tracking-widest text-gray-400">
              <th className="text-left px-6 py-4">Product</th>
              <th className="text-left px-6 py-4 hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-4 hidden md:table-cell">Section</th>
              <th className="text-left px-6 py-4">Price</th>
              <th className="text-right px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p: any) => (
              <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-12 h-12 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
                      <Image src={p.image} alt={p.name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div>
                      <p className="font-medium text-accent-dark">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="capitalize text-gray-500">{p.category}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.section === 'new_collection' ? 'bg-accent-gold/10 text-accent-gold' : 'bg-gray-100 text-gray-500'}`}>
                    {p.section === 'new_collection' ? 'New Collection' : 'Gallery'}
                  </span>
                </td>
                <td className="px-6 py-4 text-accent-gold font-medium">
                  ₦{(p.price * 1600).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/products/${p.id}`} className="p-2 hover:text-accent-gold transition-colors text-gray-400">
                      <Pencil size={16} />
                    </Link>
                    <DeleteProductButton productId={p.id} />
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
