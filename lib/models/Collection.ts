import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image: string;
  order: number;
}

const CollectionSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  image: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);
