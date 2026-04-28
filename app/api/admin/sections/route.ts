import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Section from '@/lib/models/Section';

function isAdmin(userId: string | null) {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).includes(userId);
}

const DEFAULTS = [
  { name: 'All Products', slug: 'all_products', description: 'Browse all products', image: '/products/original-designer-perfume.jpeg', order: 0 },
  { name: 'New Arrivals', slug: 'new_arrivals', description: 'Latest arrivals and new releases', image: '/products/afnan-9pm-elixir-parfum-intense-100ml.jpg', order: 1 },
  { name: 'Best Sellers', slug: 'best_sellers', description: 'Most popular products', image: '/products/rasasi-hawas-edp-100ml-for-men.jpg', order: 2 },
  { name: 'New Collection', slug: 'new_collection', description: 'Homepage new collection products', image: '/products/gift-set.jpeg', order: 3 },
  { name: 'Gallery', slug: 'gallery', description: 'Homepage gallery products', image: '/products/arabian-luxury-perfume.webp', order: 4 },
];

export async function GET() {
  await connectDB();
  await Promise.all(
    DEFAULTS.map(d =>
      Section.updateOne({ slug: d.slug }, { $setOnInsert: d }, { upsert: true })
    )
  );
  const sections = await Section.find().sort({ order: 1, name: 1 }).lean();
  return NextResponse.json(sections);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { name, description, image, order } = await req.json();
    const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const section = await Section.create({ name, slug, description: description || '', image: image || '', order: order ?? 0 });
    return NextResponse.json(section, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: err instanceof Error ? err.message : 'Failed to create section' }, { status: 500 });
  }
}
