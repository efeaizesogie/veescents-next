import mongoose, { Schema } from 'mongoose';

const CartItemSchema = new Schema({
  productId: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
}, { _id: false });

const UserCartSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  items: [CartItemSchema],
}, { timestamps: true });

export default mongoose.models.UserCart || mongoose.model('UserCart', UserCartSchema);
