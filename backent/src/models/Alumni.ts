import mongoose, { Document, Schema } from "mongoose";

export interface IAlumniDocument extends Document {
  name: string;
  role: string;
  company: string;
  place: string;  // New field: Place/City where alumni is working
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const alumniSchema = new Schema<IAlumniDocument>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
    profileImageUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export const AlumniModel = mongoose.model<IAlumniDocument>(
  "Alumni",
  alumniSchema,
  "alumni"
);
