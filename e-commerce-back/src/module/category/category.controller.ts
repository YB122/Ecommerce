/** Category routes: public listing + admin CRUD with image upload */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { upload, uploadSingle } from "../../common/middleware/multer.js";
import { validateInput } from "../../common/utils/validate.js";
import {
  createCategoryValidate,
  updateCategoryValidate,
} from "./category.validate.js";
import {
  getAllCategories,
  getCategoryById,
  softDeleteCategory,
  getActiveCategories,
  getSubcategoriesByCategory,
  createCategory,
  updateCategory,
} from "./category.service.js";

const router = Router();

/** Public routes */
router.get("/", getActiveCategories);

/** Admin routes — must be registered BEFORE /:id to avoid route conflict */
router.post(
  "/admin",
  auth,
  allowRoles("admin", "superAdmin"),
  uploadSingle(10, "image"),
  validateInput(createCategoryValidate),
  createCategory,
);
router.put(
  "/admin/:id",
  auth,
  allowRoles("admin", "superAdmin"),
  uploadSingle(2, "image"),
  validateInput(updateCategoryValidate),
  updateCategory,
);
router.get(
  "/admin",
  auth,
  allowRoles("admin", "superAdmin"),
  getAllCategories,
);
router.get(
  "/admin/:id",
  auth,
  allowRoles("admin", "superAdmin"),
  getCategoryById,
);
router.delete(
  "/admin/:id",
  auth,
  allowRoles("admin", "superAdmin"),
  softDeleteCategory,
);

/** Public parameterized routes — must be after /admin routes */
router.get("/:id/subcategories", getSubcategoriesByCategory);

export default router;
