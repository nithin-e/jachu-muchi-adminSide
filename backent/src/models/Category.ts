import mongoose, { Document, Schema } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  /** Normalized for unique index (lowercase trimmed name). */
  nameKey: string;
  /** Placeholder until products reference categories; defaults to 0. */
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    nameKey: { type: String, required: true, unique: true, trim: true },
    productCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

categorySchema.pre("save", function setNameKey() {
  if (this.isModified("name")) {
    this.nameKey = this.name.trim().toLowerCase();
  }
});

const stripNameKey = (_doc: unknown, ret: unknown) => {
  const plain = ret as Record<string, unknown>;
  const { nameKey: _drop, ...rest } = plain;
  return rest;
};

categorySchema.set("toJSON", { transform: stripNameKey });
categorySchema.set("toObject", { transform: stripNameKey });

export const CategoryModel = mongoose.model<ICategoryDocument>(
  "categories",
  categorySchema
);
