import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Section from '@/lib/models/Section';

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
      update.slug = String(body.name).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    }
    const section = await Section.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    if (!section) return NextResponse.json({ message: 'Not found' }, { status: 404 });
    return NextResponse.json(section);
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
    await Section.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Deleted' });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
