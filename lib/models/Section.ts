import mongoose, { Schema, Document } from 'mongoose';

export interface ISection extends Document {
  name: string;
  slug: string;
  description?: string;
  order: number;
}

const SectionSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.Section || mongoose.model<ISection>('Section', SectionSchema);
