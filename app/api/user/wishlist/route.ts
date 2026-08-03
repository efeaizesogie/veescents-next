import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import UserWishlist from '@/lib/models/UserWishlist';

export async function GET() {
  try {
    const { userId } = await auth();
    console.log(`[API /api/user/wishlist] GET requested. userId: ${userId}`);
    if (!userId) {
      return NextResponse.json({ productIds: [] });
    }
    await connectDB();
    const doc = await UserWishlist.findOne({ userId }).lean() as any;
    console.log(`[API /api/user/wishlist] GET success. userId: ${userId}, wishlist items returned: ${doc?.productIds?.length || 0}`);
    return NextResponse.json({ productIds: doc?.productIds ?? [] });
  } catch (err: any) {
    console.error(`[API /api/user/wishlist] GET error:`, err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.warn(`[API /api/user/wishlist] POST Unauthorized attempt.`);
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { productIds } = await req.json();
    console.log(`[API /api/user/wishlist] POST request. userId: ${userId}, items to save:`, productIds?.length || 0);
    await connectDB();
    const doc = await UserWishlist.findOneAndUpdate({ userId }, { productIds }, { upsert: true, new: true });
    console.log(`[API /api/user/wishlist] POST success. userId: ${userId}, updated DB wishlist count: ${doc?.productIds?.length || 0}`);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(`[API /api/user/wishlist] POST error:`, err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
