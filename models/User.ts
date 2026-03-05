import mongoose, { Schema, Model } from "mongoose";

export interface IUser {
  _id?: mongoose.Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSetupComplete: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    firstName:       { type: String,  required: true, trim: true },
    lastName:        { type: String,  required: true, trim: true },
    email:           { type: String,  required: true, unique: true, lowercase: true, trim: true },
    password:        { type: String,  required: true },
    isSetupComplete: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Avoid model re-compilation during Next.js hot-reload
const User: Model<IUser> =
  mongoose.models.User ?? mongoose.model<IUser>("User", UserSchema);

export default User;
