/** User model: auth, roles, profile, soft delete. */
import mongoose, { Schema } from "mongoose";
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, default: null },
    isActive: { type: Boolean, default: false },
    imageURL: { type: String, default: null },
    role: { type: String, enum: ["admin", "user", "superAdmin"], default: "user" },
    phone: { type: String, default: null },
    googleId: { type: String, default: null },
    isBlocked: { type: Boolean, default: false },
}, { timestamps: true });
export const userModel = mongoose.model("User", userSchema);
//# sourceMappingURL=user.model.js.map