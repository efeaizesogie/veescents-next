import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import UserCart from '@/lib/models/UserCart';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log(`[API /api/user/cart] GET requested. userId: ${userId}`);
    if (!userId) {
      return NextResponse.json({ items: [] });
    }
    await connectDB();
    const doc = await UserCart.findOne({ userId }).lean() as any;
    console.log(`[API /api/user/cart] GET success. userId: ${userId}, DB items returned: ${doc?.items?.length || 0}`);
    return NextResponse.json({ items: doc?.items ?? [] });
  } catch (err: any) {
    console.error(`[API /api/user/cart] GET error:`, err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.warn(`[API /api/user/cart] POST Unauthorized attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { items } = await req.json();
    console.log(`[API /api/user/cart] POST request. userId: ${userId}, items to save:`, items?.length || 0);
    await connectDB();
    const doc = await UserCart.findOneAndUpdate({ userId }, { items }, { upsert: true, new: true });
    console.log(`[API /api/user/cart] POST success. userId: ${userId}, updated DB items count: ${doc?.items?.length || 0}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(`[API /api/user/cart] POST error:`, err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.warn(`[API /api/user/cart] DELETE Unauthorized attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    console.log(`[API /api/user/cart] DELETE request. userId: ${userId}`);
    await connectDB();
    await UserCart.findOneAndUpdate({ userId }, { items: [] });
    console.log(`[API /api/user/cart] DELETE success (cleared DB cart). userId: ${userId}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(`[API /api/user/cart] DELETE error:`, err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
