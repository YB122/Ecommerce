/** User model: auth, roles, profile, soft delete. */
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string | null;
  isActive: boolean;
  imageURL?: string | null;
  role: "admin" | "user" | "superAdmin";
  phone?: string | null;
  googleId?: string | null;
  isBlocked: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    imageURL: { type: String, default: null },
    role: { type: String, enum: ["admin", "user", "superAdmin"], default: "user" },
    phone: { type: String, default: null },
    googleId: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const userModel = mongoose.model<IUser>("User", userSchema);
