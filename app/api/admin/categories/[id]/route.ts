import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/lib/models/Category';

function isAdmin(userId: string | null) {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).includes(userId);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const update: Record<string, unknown> = {
      description: body.description || '',
      image: body.image || '',
      order: Number(body.order ?? 0),
    };
    if (body.name) {
      update.name = body.name;
      update.slug = String(body.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }
    const cat = await Category.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!cat) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(cat);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const { id } = await params;
    await Category.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
