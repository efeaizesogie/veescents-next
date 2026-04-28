import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import UserWishlist from '@/lib/models/UserWishlist';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ productIds: [] });
  await connectDB();
  const doc = await UserWishlist.findOne({ userId }).lean() as any;
  return NextResponse.json({ productIds: doc?.productIds ?? [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { productIds } = await req.json();
  await connectDB();
  await UserWishlist.findOneAndUpdate({ userId }, { productIds }, { upsert: true, new: true });
  return NextResponse.json({ ok: true });
}
