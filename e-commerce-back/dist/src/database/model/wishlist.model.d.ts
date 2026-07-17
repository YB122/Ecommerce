/** Wishlist model: userId + productId, belongsTo Product. */
import mongoose, { Document, Types } from "mongoose";
export interface IWishlist extends Document {
    userId: Types.ObjectId;
    productId: Types.ObjectId;
}
export declare const wishlistModel: mongoose.Model<IWishlist, {}, {}, {}, mongoose.Document<unknown, {}, IWishlist, {}, mongoose.DefaultSchemaOptions> & IWishlist & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IWishlist>;
//# sourceMappingURL=wishlist.model.d.ts.map