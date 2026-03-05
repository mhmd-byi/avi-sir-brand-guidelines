import mongoose, { Schema, Model } from "mongoose";

export interface IBrandSettings {
  _id?: mongoose.Types.ObjectId;
  primaryColor: string;
  secondaryColor: string;
  // Logos
  stackedLogo?: string;
  landscapeLogo?: string;
  stackedLogoBlack?: string;
  landscapeLogoBlack?: string;
  stackedLogoWhite?: string;
  landscapeLogoWhite?: string;
  updatedAt?: Date;
}

const BrandSettingsSchema = new Schema<IBrandSettings>(
  {
    primaryColor:   { type: String, required: true },
    secondaryColor: { type: String, required: true },
    stackedLogo:    { type: String },
    landscapeLogo:  { type: String },
    stackedLogoBlack:    { type: String },
    landscapeLogoBlack:  { type: String },
    stackedLogoWhite:    { type: String },
    landscapeLogoWhite:  { type: String },
  },
  { timestamps: true }
);

// Singleton model — only one document is ever stored
const BrandSettings: Model<IBrandSettings> =
  mongoose.models.BrandSettings ??
  mongoose.model<IBrandSettings>("BrandSettings", BrandSettingsSchema);

export default BrandSettings;
