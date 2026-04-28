import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Collection from '@/lib/models/Collection';

export async function GET() {
  try {
    await connectDB();
    const collections = await Collection.find().sort({ order: 1 }).lean();
    return NextResponse.json(collections);
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
