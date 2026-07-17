import { categoryModel } from "../../database/model/category.model.js";
import { subcategoryModel } from "../../database/model/subcategory.model.js";
import { productModel } from "../../database/model/product.model.js";
import { userModel } from "../../database/model/user.model.js";
import { uploadImage, deleteImageByUrl } from "../../common/utils/uploadImage.js";
export const createCategory = async (req, res) => {
    try {
        const { en_name, ar_name, fr_name } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const admin = await userModel.findById(userId);
        if (!admin || !admin.email) {
            res.status(404).json({ message: "Admin not found" });
            return;
        }
        const existing = await categoryModel.findOne({ en_name });
        if (existing) {
            res.status(400).json({ message: "Category already exists" });
            return;
        }
        if (ar_name) {
            const existingAr = await categoryModel.findOne({ ar_name });
            if (existingAr) {
                res.status(400).json({ message: "Arabic category name already exists" });
                return;
            }
        }
        if (fr_name) {
            const existingFr = await categoryModel.findOne({ fr_name });
            if (existingFr) {
                res.status(400).json({ message: "French category name already exists" });
                return;
            }
        }
        let imageURL = null;
        if (req.file) {
            try {
                console.log("Uploading file:", req.file.originalname, req.file.mimetype, req.file.size);
                const result = await uploadImage(req.file, "categories");
                imageURL = result.url;
                console.log("Upload successful:", imageURL);
            }
            catch (err) {
                console.error("Upload failed:", err.message);
                res.status(400).json({ message: err.message });
                return;
            }
        }
        else {
            console.warn("No file received in createCategory - ensure request is multipart/form-data with field name 'image'");
        }
        const category = await categoryModel.create({
            en_name,
            ar_name: ar_name || null,
            fr_name: fr_name || null,
            imageURL,
            addedByEmail: admin.email,
            isActive: true,
        });
        res.status(201).json({ message: "Category created", data: category });
    }
    catch (error) {
        console.error("Create category error:", error);
        res.status(500).json({ message: error?.message || "Internal server error" });
    }
};
export const getAllCategories = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
        const skip = (page - 1) * limit;
        const parts = req.query.sort?.split("_") || [];
        const sortField = parts.length > 1 ? parts.slice(0, -1).join("_") : parts[0] || "createdAt";
        const sortDir = parts[parts.length - 1] === "desc" ? -1 : 1;
        const [categories, total] = await Promise.all([
            categoryModel.find().populate({
                path: "subcategories",
                populate: { path: "products" },
            }).sort({ [sortField]: sortDir }).skip(skip).limit(limit),
            categoryModel.countDocuments(),
        ]);
        res.status(200).json({ message: "Categories", data: { categories, total, page, limit } });
    }
    catch (error) {
        console.error("Get categories error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getActiveCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find({ isActive: true }).populate({
            path: "subcategories",
            match: { isActive: true },
            populate: { path: "products", match: { isActive: true } },
        });
        res.status(200).json({ message: "Categories", data: categories });
    }
    catch (error) {
        console.error("Get active categories error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getSubcategoriesByCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id);
        if (!category || !category.isActive) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        const subcategories = await subcategoryModel.find({ categoryId: id, isActive: true }).populate({
            path: "products",
            match: { isActive: true },
        });
        res.status(200).json({ message: "Subcategories", data: subcategories });
    }
    catch (error) {
        console.error("Get subcategories by category error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getCategoryById = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id).populate({
            path: "subcategories",
            populate: { path: "products" },
        });
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        res.status(200).json({ message: "Category", data: category });
    }
    catch (error) {
        console.error("Get category error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const { en_name, ar_name, fr_name, imageURL, addedByEmail } = req.body;
        const category = await categoryModel.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        if (en_name !== undefined) {
            const existing = await categoryModel.findOne({ en_name });
            if (existing && existing._id.toString() !== id) {
                res.status(400).json({ message: "Category name already exists" });
                return;
            }
            category.en_name = en_name;
        }
        if (ar_name !== undefined) {
            if (ar_name) {
                const existingAr = await categoryModel.findOne({ ar_name });
                if (existingAr && existingAr._id.toString() !== id) {
                    res.status(400).json({ message: "Arabic category name already exists" });
                    return;
                }
            }
            category.ar_name = ar_name || null;
        }
        if (fr_name !== undefined) {
            if (fr_name) {
                const existingFr = await categoryModel.findOne({ fr_name });
                if (existingFr && existingFr._id.toString() !== id) {
                    res.status(400).json({ message: "French category name already exists" });
                    return;
                }
            }
            category.fr_name = fr_name || null;
        }
        if (addedByEmail !== undefined) {
            category.addedByEmail = addedByEmail;
        }
        if (req.file) {
            try {
                console.log("Uploading file:", req.file.originalname, req.file.mimetype, req.file.size);
                if (category.imageURL) {
                    await deleteImageByUrl(category.imageURL, "categories");
                }
                const result = await uploadImage(req.file, "categories");
                category.imageURL = result.url;
                console.log("Upload successful:", category.imageURL);
            }
            catch (err) {
                console.error("Upload failed:", err.message);
                res.status(400).json({ message: err.message });
                return;
            }
        }
        else if (imageURL !== undefined) {
            category.imageURL = imageURL;
        }
        else {
            console.warn("No file received in updateCategory");
        }
        await category.save();
        res.status(200).json({ message: "Category updated", data: category });
    }
    catch (error) {
        console.error("Update category error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const softDeleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await categoryModel.findById(id);
        if (!category) {
            res.status(404).json({ message: "Category not found" });
            return;
        }
        const subcategories = await subcategoryModel.find({ categoryId: id });
        const subcategoryIds = subcategories.map((sub) => sub._id);
        if (subcategoryIds.length > 0) {
            await productModel.updateMany({ subcategoryId: { $in: subcategoryIds } }, { isActive: false });
            await subcategoryModel.updateMany({ _id: { $in: subcategoryIds } }, { isActive: false });
        }
        category.isActive = false;
        await category.save();
        res.status(200).json({ message: "Category soft deleted" });
    }
    catch (error) {
        console.error("Soft delete category error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=category.service.js.map