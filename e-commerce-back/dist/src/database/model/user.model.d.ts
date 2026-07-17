/** User model: auth, roles, profile, soft delete. */
import mongoose, { Document } from "mongoose";
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
export declare const userModel: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser, {}, mongoose.DefaultSchemaOptions> & IUser & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IUser>;
//# sourceMappingURL=user.model.d.ts.map