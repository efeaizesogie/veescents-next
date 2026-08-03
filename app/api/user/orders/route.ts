import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/lib/models/Order';

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        const body = await req.json();

        const {
            email,
            fullName,
            phone,
            address,
            city,
            state,
            items,
            totalAmount,
            shippingCost,
            paymentMethod,
            paymentStatus,
            reference,
        } = body;

        // Validate inputs
        if (!email || !fullName || !phone || !address || !city || !state || !items || !Array.isArray(items) || items.length === 0 || !totalAmount || !paymentMethod || !reference) {
            return NextResponse.json({ message: 'Missing required order fields' }, { status: 400 });
        }

        await connectDB();

        const order = await Order.create({
            userId: userId || undefined,
            email,
            fullName,
            phone,
            address,
            city,
            state,
            items,
            totalAmount,
            shippingCost: shippingCost || 0,
            paymentMethod,
            paymentStatus: paymentStatus || 'Pending',
            reference,
        });

        return NextResponse.json(order, { status: 201 });
    } catch (err) {
        console.error('Failed to create order:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
