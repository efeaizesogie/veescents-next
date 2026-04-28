import { connectDB } from '@/lib/mongodb';
import Collection from '@/lib/models/Collection';
import CollectionForm from '@/components/admin/CollectionForm';
import { notFound } from 'next/navigation';

export default async function EditCollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const col = await Collection.findOne({ slug }).lean() as any;
  if (!col) notFound();

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-accent-dark">Edit Collection</h1>
        <p className="text-gray-400 text-sm mt-1">{col.name}</p>
      </div>
      <CollectionForm collection={col} />
    </div>
  );
}
