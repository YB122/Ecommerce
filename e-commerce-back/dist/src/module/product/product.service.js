import { productModel } from "../../database/model/product.model.js";
import { subcategoryModel } from "../../database/model/subcategory.model.js";
import { userModel } from "../../database/model/user.model.js";
import { buildQuery } from "../../common/utils/buildQuery.js";
import { env } from "../../../config/env.service.js";
import { uploadImages, uploadBase64Image, deleteImagesByUrls } from "../../common/utils/uploadImage.js";
export const createProduct = async (req, res) => {
    try {
        const { en_name, ar_name, fr_name, en_description, ar_description, fr_description, price, discount, variants, colorImages, subcategoryId, } = req.body;
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
        const subcategory = await subcategoryModel.findById(subcategoryId);
        if (!subcategory) {
            res.status(404).json({ message: "Subcategory not found" });
            return;
        }
        let imageURLs = null;
        const files = req.files;
        if (files && files.length > 0) {
            try {
                const results = await uploadImages(files, "products");
                imageURLs = JSON.stringify(results.map((r) => r.url));
            }
            catch (err) {
                res.status(400).json({ message: err.message });
                return;
            }
        }
        let colorImagesObj = {};
        if (colorImages) {
            const arr = Array.isArray(colorImages) ? colorImages : JSON.parse(colorImages);
            for (const ci of arr) {
                if (!ci.imageURL)
                    continue;
                if (ci.imageURL.startsWith("data:image/")) {
                    try {
                        const result = await uploadBase64Image(ci.imageURL, "products");
                        colorImagesObj[ci.color] = result.url;
                    }
                    catch {
                        colorImagesObj[ci.color] = ci.imageURL;
                    }
                }
                else {
                    colorImagesObj[ci.color] = ci.imageURL;
                }
            }
        }
        const product = await productModel.create({
            en_name,
            ar_name: ar_name || null,
            fr_name: fr_name || null,
            en_description,
            ar_description: ar_description || null,
            fr_description: fr_description || null,
            price: Number(price),
            discount: discount !== undefined ? Number(discount) : 0,
            imageURLs,
            colorImages: Object.keys(colorImagesObj).length > 0 ? JSON.stringify(colorImagesObj) : null,
            variants: variants ? JSON.stringify((typeof variants === "string" ? JSON.parse(variants) : variants).map((v) => ({ color: v.color, size: v.size, stock: v.stock }))) : null,
            subcategoryId: subcategoryId,
            addedByEmail: admin.email,
            isActive: true,
        });
        res.status(201).json({ message: "Product created", data: { ...product.toJSON(), currency: env.CURRENCY } });
    }
    catch (error) {
        console.error("Create product error:", error?.message);
        res.status(500).json({ message: error?.message || "Internal server error" });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { en_name, ar_name, fr_name, en_description, ar_description, fr_description, price, discount, variants, colorImages, subcategoryId, imageURLs, addedByEmail, } = req.body;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        if (en_name !== undefined) {
            product.en_name = en_name;
        }
        if (ar_name !== undefined) {
            product.ar_name = ar_name || null;
        }
        if (fr_name !== undefined) {
            product.fr_name = fr_name || null;
        }
        if (en_description !== undefined)
            product.en_description = en_description;
        if (ar_description !== undefined)
            product.ar_description = ar_description || null;
        if (fr_description !== undefined)
            product.fr_description = fr_description || null;
        if (price !== undefined)
            product.price = Number(price);
        if (discount !== undefined)
            product.discount = Number(discount);
        if (variants !== undefined)
            product.variants = variants ? JSON.stringify((typeof variants === "string" ? JSON.parse(variants) : variants).map((v) => ({ color: v.color, size: v.size, stock: v.stock }))) : null;
        if (colorImages !== undefined) {
            const arr = Array.isArray(colorImages) ? colorImages : JSON.parse(colorImages);
            const obj = {};
            for (const ci of arr) {
                if (!ci.imageURL)
                    continue;
                if (ci.imageURL.startsWith("data:image/")) {
                    try {
                        const r = await uploadBase64Image(ci.imageURL, "products");
                        obj[ci.color] = r.url;
                    }
                    catch {
                        obj[ci.color] = ci.imageURL;
                    }
                }
                else {
                    obj[ci.color] = ci.imageURL;
                }
            }
            product.colorImages = Object.keys(obj).length > 0 ? JSON.stringify(obj) : null;
        }
        if (addedByEmail !== undefined)
            product.addedByEmail = addedByEmail;
        if (subcategoryId !== undefined) {
            const subcategory = await subcategoryModel.findById(subcategoryId);
            if (!subcategory) {
                res.status(404).json({ message: "Subcategory not found" });
                return;
            }
            product.subcategoryId = subcategoryId;
        }
        const files = req.files;
        if (files && files.length > 0) {
            try {
                if (product.imageURLs) {
                    const oldUrls = JSON.parse(product.imageURLs);
                    await deleteImagesByUrls(oldUrls, "products");
                }
                const results = await uploadImages(files, "products");
                const uploadedUrls = results.map((r) => r.url);
                product.imageURLs = JSON.stringify(uploadedUrls);
                if (colorImages !== undefined) {
                    const arr = Array.isArray(colorImages) ? colorImages : JSON.parse(colorImages);
                    const obj = {};
                    for (const ci of arr) {
                        if (ci.imageURL) {
                            if (ci.imageURL.startsWith("data:image/")) {
                                try {
                                    const r = await uploadBase64Image(ci.imageURL, "products");
                                    obj[ci.color] = r.url;
                                }
                                catch {
                                    obj[ci.color] = ci.imageURL;
                                }
                            }
                            else {
                                obj[ci.color] = ci.imageURL;
                            }
                        }
                    }
                    product.colorImages = Object.keys(obj).length > 0 ? JSON.stringify(obj) : null;
                }
            }
            catch (err) {
                res.status(400).json({ message: err.message });
                return;
            }
        }
        else if (imageURLs !== undefined) {
            product.imageURLs = imageURLs;
        }
        await product.save();
        res.status(200).json({ message: "Product updated", data: { ...product.toJSON(), currency: env.CURRENCY } });
    }
    catch (error) {
        console.error("Update product error:", error?.message);
        res.status(500).json({ message: error?.message || "Internal server error" });
    }
};
const VALIDATION_PREFIXES = [
    "page must",
    "limit must",
    "minPrice must",
    "maxPrice must",
    "sort must",
    "search must",
];
const handleError = (error, res) => {
    if (error instanceof Error && VALIDATION_PREFIXES.some((p) => error.message.startsWith(p))) {
        return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
};
export const getAllProducts = async (req, res) => {
    try {
        const { where, order, offset, limit, page } = buildQuery({
            reqQuery: req.query,
        });
        const [products, count] = await Promise.all([
            productModel.find(where).sort(order).skip(offset).limit(limit),
            productModel.countDocuments(where),
        ]);
        res.status(200).json({
            message: "Products",
            data: { products, total: count, page, limit, currency: env.CURRENCY },
        });
    }
    catch (error) {
        console.error("Get products error:", error?.message);
        handleError(error, res);
    }
};
export const getActiveProducts = async (req, res) => {
    try {
        const { where, order, offset, limit, page } = buildQuery({
            reqQuery: req.query,
            extraWhere: { isActive: true },
        });
        const [products, count] = await Promise.all([
            productModel.find(where).sort(order).skip(offset).limit(limit),
            productModel.countDocuments(where),
        ]);
        res.status(200).json({
            message: "Products",
            data: { products, total: count, page, limit, currency: env.CURRENCY },
        });
    }
    catch (error) {
        console.error("Get active products error:", error?.message);
        handleError(error, res);
    }
};
export const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product", data: { ...product.toJSON(), currency: env.CURRENCY } });
    }
    catch (error) {
        console.error("Get product error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getActiveProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findOne({ _id: id, isActive: true });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.status(200).json({ message: "Product", data: { ...product.toJSON(), currency: env.CURRENCY } });
    }
    catch (error) {
        console.error("Get product error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getProductsByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const subcategories = await subcategoryModel.find({ categoryId, isActive: true });
        const subcategoryIds = subcategories.map((s) => s._id);
        if (subcategoryIds.length === 0) {
            res.status(200).json({
                message: "Products",
                data: { products: [], total: 0, currency: env.CURRENCY },
            });
            return;
        }
        const { where, order, offset, limit, page } = buildQuery({
            reqQuery: req.query,
            extraWhere: { isActive: true },
        });
        where.subcategoryId = { $in: subcategoryIds };
        const [products, count] = await Promise.all([
            productModel.find(where).sort(order).skip(offset).limit(limit),
            productModel.countDocuments(where),
        ]);
        res.status(200).json({
            message: "Products",
            data: { products, total: count, page, limit, currency: env.CURRENCY },
        });
    }
    catch (error) {
        console.error("Get products by category error:", error?.message);
        handleError(error, res);
    }
};
export const getProductsBySubcategory = async (req, res) => {
    try {
        const subcategoryId = req.params.subcategoryId;
        const { where, order, offset, limit, page } = buildQuery({
            reqQuery: req.query,
            extraWhere: { isActive: true },
        });
        where.subcategoryId = subcategoryId;
        const [products, count] = await Promise.all([
            productModel.find(where).sort(order).skip(offset).limit(limit),
            productModel.countDocuments(where),
        ]);
        res.status(200).json({
            message: "Products",
            data: { products, total: count, page, limit, currency: env.CURRENCY },
        });
    }
    catch (error) {
        console.error("Get products by subcategory error:", error?.message);
        handleError(error, res);
    }
};
export const softDeleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await productModel.findById(id);
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        product.isActive = false;
        await product.save();
        res.status(200).json({ message: "Product soft deleted" });
    }
    catch (error) {
        console.error("Soft delete product error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=product.service.js.map