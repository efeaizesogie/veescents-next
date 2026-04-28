import CollectionForm from '@/components/admin/CollectionForm';

export default function NewCollectionPage() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl text-accent-dark">Add Collection</h1>
        <p className="text-gray-400 text-sm mt-1">Create a new product collection</p>
      </div>
      <CollectionForm />
    </div>
  );
}
