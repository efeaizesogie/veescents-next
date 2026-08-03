import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export interface IOrder extends Document {
    userId?: string;
    email: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    items: IOrderItem[];
    totalAmount: number;
    shippingCost: number;
    paymentMethod: string;
    paymentStatus: string;
    reference: string;
    createdAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>({
    userId: { type: String },
    email: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    shippingCost: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: String, default: 'Pending' },
    reference: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
