import mongoose, { Document, Schema } from "mongoose";

export const STORE_STATUS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
} as const;

export type StoreStatus = "Active" | "Inactive";
export const STORE_STATUS_VALUES: StoreStatus[] = [
  STORE_STATUS.ACTIVE,
  STORE_STATUS.INACTIVE,
];

export interface IStoreDocument extends Document {
  name: string;
  description: string;
  images: string[];
  status: StoreStatus;
  address?: string;
  phone?: string;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

const storeSchema = new Schema<IStoreDocument>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: STORE_STATUS_VALUES,
      default: STORE_STATUS.ACTIVE,
    },
    address: { type: String, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { timestamps: true }
);

export const StoreModel = mongoose.model<IStoreDocument>(
  "stores",
  storeSchema
);
