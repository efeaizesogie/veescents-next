import { Suspense } from 'react';
import StorePage from '@/components/StorePage';

export default function StoreRoute() {
  return (
    <Suspense>
      <StorePage />
    </Suspense>
  );
}
