import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/lib/models/Category';

function isAdmin(userId: string | null) {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).includes(userId);
}

const DEFAULTS = [
  { name: 'Men', slug: 'men', description: 'Fragrances for men', image: '/products/armaf-club-de-nuit-intense-edt-105ml-for-men.jpg', order: 0 },
  { name: 'Women', slug: 'women', description: 'Fragrances for women', image: '/products/afnan-rare-reef-edp-100ml.jpeg', order: 1 },
  { name: 'Unisex', slug: 'unisex', description: 'Fragrances for everyone', image: '/products/original-designer-perfume.jpeg', order: 2 },
];

export async function GET() {
  await connectDB();
  // Seed defaults if they don't exist yet
  await Promise.all(
    DEFAULTS.map(d =>
      Category.updateOne({ slug: d.slug }, { $setOnInsert: d }, { upsert: true })
    )
  );
  const cats = await Category.find().sort({ order: 1, name: 1 }).lean();
  return NextResponse.json(cats);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { name, description, image, order } = await req.json();
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const cat = await Category.create({ name, slug, description: description || '', image: image || '', order: order ?? 0 });
    return NextResponse.json(cat, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: err instanceof Error ? err.message : 'Failed to create category' }, { status: 500 });
  }
}
