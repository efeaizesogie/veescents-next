import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/lib/models/Collection';

function isAdmin(userId: string | null) {
  if (!userId) return false;
  return (process.env.ADMIN_USER_IDS || '').split(',').map(id => id.trim()).includes(userId);
}

export async function GET() {
  await connectDB();
  const collections = await Collection.find().sort({ order: 1 }).lean();
  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!isAdmin(userId)) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  try {
    await connectDB();
    const body = await req.json();
    const last = await Collection.findOne().sort({ id: -1 });
    const id = last ? last.id + 1 : 1;
    const col = await Collection.create({ ...body, id });
    return NextResponse.json(col, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
