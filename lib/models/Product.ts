import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  id: number;
  name: string;
  brand: string;
  price: number;
  rating: number;
  image: string;
  isNewProduct?: boolean;
  salesCount?: number;
  category: 'men' | 'women' | 'unisex';
  section: 'new_collection' | 'gallery';
}

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  isNewProduct: { type: Boolean, default: false },
  salesCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  cat: { type: String, enum: ['niche', 'gift_set', 'body_care', 'candles', 'deodorants', 'celebrity', 'perfume_oil', 'combo'], default: null },
  category: { type: String, enum: ['men', 'women', 'unisex'], required: true },
  section: { type: String, enum: ['new_collection', 'gallery'], required: true },
});

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
