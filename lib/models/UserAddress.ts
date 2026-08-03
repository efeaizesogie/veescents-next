import mongoose, { Schema, Document } from 'mongoose';

export interface IUserAddress extends Document {
    userId: string;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    updatedAt: Date;
}

const UserAddressSchema = new Schema<IUserAddress>({
    userId: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.UserAddress || mongoose.model<IUserAddress>('UserAddress', UserAddressSchema);
