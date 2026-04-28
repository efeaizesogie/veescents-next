'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';

export default function DeleteProductButton({ productId }: { productId: number }) {
  const [confirming, setConfirming] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
    router.refresh();
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <button onClick={handleDelete} className="text-xs text-red-500 font-bold hover:text-red-700">Yes</button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-400 hover:text-gray-600">No</button>
      </div>
    );
  }

  return (
    <button onClick={() => setConfirming(true)} className="p-2 hover:text-red-500 transition-colors text-gray-400">
      <Trash2 size={16} />
    </button>
  );
}
