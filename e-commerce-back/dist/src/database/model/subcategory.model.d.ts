/** Subcategory model: name, belongsTo Category, soft delete, hasMany Products. */
import mongoose, { Document, Types } from "mongoose";
export interface ISubcategory extends Document {
    en_name: string;
    ar_name?: string | null;
    fr_name?: string | null;
    categoryId: Types.ObjectId;
    addedByEmail: string;
    isActive: boolean;
}
export declare const subcategoryModel: mongoose.Model<ISubcategory, {}, {}, {}, mongoose.Document<unknown, {}, ISubcategory, {}, mongoose.DefaultSchemaOptions> & ISubcategory & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ISubcategory>;
//# sourceMappingURL=subcategory.model.d.ts.map