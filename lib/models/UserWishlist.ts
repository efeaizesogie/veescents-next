import mongoose, { Schema } from 'mongoose';

const UserWishlistSchema = new Schema({
  userId: { type: String, required: true, unique: true },
  productIds: [{ type: Number }],
}, { timestamps: true });

export default mongoose.models.UserWishlist || mongoose.model('UserWishlist', UserWishlistSchema);
