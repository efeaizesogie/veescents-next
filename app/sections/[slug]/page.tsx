import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { connectDB } from '@/lib/mongodb';
import Section from '@/lib/models/Section';
import SectionProductsClient from './SectionProductsClient';

export const dynamic = 'force-dynamic';

async function getSection(slug: string) {
  await connectDB();
  return Section.findOne({ slug }).lean() as any;
}

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = await getSection(slug);
  if (!section) notFound();

  return (
    <Suspense>
      <SectionProductsClient section={{ name: section.name, slug: section.slug, description: section.description }} />
    </Suspense>
  );
}
