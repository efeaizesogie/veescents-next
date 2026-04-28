import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-accent-dark">Add Product</h1>
        <p className="text-gray-400 text-sm mt-1">Create a new product listing</p>
      </div>
      <ProductForm />
    </div>
  );
}
