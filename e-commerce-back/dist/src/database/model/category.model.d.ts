/** Category model: name, image, soft delete, hasMany Subcategories. */
import mongoose, { Document } from "mongoose";
export interface ICategory extends Document {
    en_name: string;
    ar_name?: string | null;
    fr_name?: string | null;
    imageURL?: string | null;
    addedByEmail: string;
    isActive: boolean;
}
export declare const categoryModel: mongoose.Model<ICategory, {}, {}, {}, mongoose.Document<unknown, {}, ICategory, {}, mongoose.DefaultSchemaOptions> & ICategory & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICategory>;
//# sourceMappingURL=category.model.d.ts.map