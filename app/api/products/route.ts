import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/lib/models/Product';

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find().lean();
    return NextResponse.json(products);
  } catch (err: any) {
    console.error('API /products error:', err.message);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
