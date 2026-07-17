/** Subcategory business logic: CRUD */
import { Request, Response } from "express";
import { subcategoryModel } from "../../database/model/subcategory.model.js";
import { categoryModel } from "../../database/model/category.model.js";
import { userModel } from "../../database/model/user.model.js";
import { productModel } from "../../database/model/product.model.js";
import mongoose from "mongoose";

export const createSubcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== "object") {
      console.error("Create subcategory — req.body:", req.body, "Content-Type:", req.headers["content-type"]);
      res.status(400).json({ message: "Request body is required. Use Content-Type: application/json" });
      return;
    }
    const { en_name, ar_name, fr_name, categoryId } = req.body;
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

    const category = await categoryModel.findById(categoryId);
    console.log("category", category);
    if (!category) {
      res.status(404).json({ message: "Category not found" });
      return;
    }

    const existing = await subcategoryModel.findOne({ en_name, categoryId });
    if (existing) {
      res.status(400).json({ message: "Subcategory already exists" });
      return;
    }

    if (ar_name) {
      const existingAr = await subcategoryModel.findOne({ ar_name, categoryId });
      if (existingAr) {
        res.status(400).json({ message: "Arabic subcategory name already exists" });
        return;
      }
    }

    if (fr_name) {
      const existingFr = await subcategoryModel.findOne({ fr_name, categoryId });
      if (existingFr) {
        res.status(400).json({ message: "French subcategory name already exists" });
        return;
      }
    }

    const subcategory = await subcategoryModel.create({
      en_name,
      ar_name: ar_name || null,
      fr_name: fr_name || null,
      categoryId: categoryId,
      addedByEmail: admin.email,
      isActive: true,
    });

    res.status(201).json({ message: "Subcategory created", data: subcategory });
  } catch (error: any) {
    console.error("Create subcategory error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getActiveSubcategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const subcategories = await subcategoryModel.find({ isActive: true }).populate({
      path: "products",
      match: { isActive: true },
    });
    res.status(200).json({ message: "Subcategories", data: subcategories });
  } catch (error: any) {
    console.error("Get subcategories error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getActiveSubcategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const subcategory = await subcategoryModel.findOne({ _id: id, isActive: true }).populate({
      path: "products",
      match: { isActive: true },
    });
    if (!subcategory) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }
    res.status(200).json({ message: "Subcategory", data: subcategory });
  } catch (error: any) {
    console.error("Get subcategory error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllSubcategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 25));
    const skip = (page - 1) * limit;
    const parts = (req.query.sort as string)?.split("_") || [];
    const sortField = parts.length > 1 ? parts.slice(0, -1).join("_") : parts[0] || "createdAt";
    const sortDir = parts[parts.length - 1] === "desc" ? -1 : 1;

    const filter: Record<string, any> = {};
    if (req.query.categoryId) {
      filter.categoryId = req.query.categoryId;
    }
    if (req.query.en_name) {
      filter.en_name = req.query.en_name;
    }
    if (req.query.q) {
      filter.en_name = { $regex: req.query.q, $options: "i" };
    }

    const [subcategories, total] = await Promise.all([
      subcategoryModel.find(filter).populate({ path: "products" }).sort({ [sortField]: sortDir }).skip(skip).limit(limit),
      subcategoryModel.countDocuments(filter),
    ]);
    res.status(200).json({ message: "Subcategories", data: { subcategories, total, page, limit } });
  } catch (error: any) {
    console.error("Get subcategories error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSubcategoryById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    const subcategory = await subcategoryModel.findById(id).populate({ path: "products" });
    if (!subcategory) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }
    res.status(200).json({ message: "Subcategory", data: subcategory });
  } catch (error: any) {
    console.error("Get subcategory error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSubcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== "object") {
      res.status(400).json({ message: "Request body is required. Use Content-Type: application/json" });
      return;
    }
    const id = req.params.id as string;
    const { en_name, ar_name, fr_name, categoryId, addedByEmail, isActive } = req.body;

    const subcategory = await subcategoryModel.findById(id);
    if (!subcategory) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }

    const checkCategoryId = categoryId || subcategory.categoryId;

    if (en_name !== undefined) {
      const existing = await subcategoryModel.findOne({ en_name, categoryId: checkCategoryId });
      if (existing && existing._id.toString() !== id) {
        res.status(400).json({ message: "Subcategory name already exists" });
        return;
      }
      subcategory.en_name = en_name;
    }

    if (ar_name !== undefined) {
      if (ar_name) {
        const existingAr = await subcategoryModel.findOne({ ar_name, categoryId: checkCategoryId });
        if (existingAr && existingAr._id.toString() !== id) {
          res.status(400).json({ message: "Arabic subcategory name already exists" });
          return;
        }
      }
      subcategory.ar_name = ar_name || null;
    }
    if (fr_name !== undefined) {
      if (fr_name) {
        const existingFr = await subcategoryModel.findOne({ fr_name, categoryId: checkCategoryId });
        if (existingFr && existingFr._id.toString() !== id) {
          res.status(400).json({ message: "French subcategory name already exists" });
          return;
        }
      }
      subcategory.fr_name = fr_name || null;
    }

    if (categoryId !== undefined) {
      const category = await categoryModel.findById(categoryId);
      if (!category) {
        res.status(404).json({ message: "Category not found" });
        return;
      }
      subcategory.categoryId = categoryId;
    }

    if (addedByEmail !== undefined) {
      subcategory.addedByEmail = addedByEmail;
    }

    if (isActive !== undefined) {
      subcategory.isActive = isActive;
      if (isActive) {
        await productModel.updateMany({ subcategoryId: id }, { isActive: true });
      } else {
        await productModel.updateMany({ subcategoryId: id }, { isActive: false });
      }
    }

    await subcategory.save();
    res.status(200).json({ message: "Subcategory updated", data: subcategory });
  } catch (error: any) {
    console.error("Update subcategory error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const softDeleteSubcategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;

    const subcategory = await subcategoryModel.findById(id);
    if (!subcategory) {
      res.status(404).json({ message: "Subcategory not found" });
      return;
    }

    await productModel.updateMany({ subcategoryId: id }, { isActive: false });
    subcategory.isActive = false;
    await subcategory.save();

    res.status(200).json({ message: "Subcategory soft deleted" });
  } catch (error: any) {
    console.error("Soft delete subcategory error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
