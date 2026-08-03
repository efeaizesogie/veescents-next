import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectDB } from '@/lib/mongodb';
import UserAddress from '@/lib/models/UserAddress';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        await connectDB();
        const address = await UserAddress.findOne({ userId }).lean();
        return NextResponse.json(address || null);
    } catch (err) {
        console.error('Failed to get address:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { fullName, phone, address, city, state } = await req.json();

        if (!fullName || !phone || !address || !city || !state) {
            return NextResponse.json({ message: 'Missing required address fields' }, { status: 400 });
        }

        await connectDB();
        const doc = await UserAddress.findOneAndUpdate(
            { userId },
            { fullName, phone, address, city, state, updatedAt: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json(doc);
    } catch (err) {
        console.error('Failed to update address:', err);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
