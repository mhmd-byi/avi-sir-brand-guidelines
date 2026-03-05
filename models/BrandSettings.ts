import mongoose, { Schema, Model } from "mongoose";

export interface IBrandSettings {
  _id?: mongoose.Types.ObjectId;
  primaryColor: string;
  secondaryColor: string;
  updatedAt?: Date;
}

const BrandSettingsSchema = new Schema<IBrandSettings>(
  {
    primaryColor:   { type: String, required: true },
    secondaryColor: { type: String, required: true },
  },
  { timestamps: true }
);

// Singleton model — only one document is ever stored
const BrandSettings: Model<IBrandSettings> =
  mongoose.models.BrandSettings ??
  mongoose.model<IBrandSettings>("BrandSettings", BrandSettingsSchema);

export default BrandSettings;
