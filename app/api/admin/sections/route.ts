import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Section from '@/lib/models/Section';

function isAdmin(userId: string | null) {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).includes(userId);
}

const DEFAULTS = [
  { name: 'New Collection', slug: 'new_collection', description: 'Latest arrivals and new releases', order: 0 },
  { name: 'Gallery', slug: 'gallery', description: 'Main product gallery', order: 1 },
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
    const { name, description, order } = await req.json();
    const slug = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const section = await Section.create({ name, slug, description: description || '', order: order ?? 0 });
    return NextResponse.json(section, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
