import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import UserCart from '@/lib/models/UserCart';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ items: [] });
  await connectDB();
  const doc = await UserCart.findOne({ userId }).lean() as any;
  return NextResponse.json({ items: doc?.items ?? [] });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  const { items } = await req.json();
  await connectDB();
  await UserCart.findOneAndUpdate({ userId }, { items }, { upsert: true, new: true });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  await connectDB();
  await UserCart.findOneAndUpdate({ userId }, { items: [] });
  return NextResponse.json({ ok: true });
}
