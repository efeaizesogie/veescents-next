import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';
import ProductForm from '@/components/admin/ProductForm';
import { notFound } from 'next/navigation';

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const product = await Product.findOne({ id: Number(id) }).lean() as any;
  if (!product) notFound();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-accent-dark">Edit Product</h1>
        <p className="text-gray-400 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm product={{ ...product, id: product.id }} />
    </div>
  );
}
