/** Subcategory routes: public listing + admin CRUD */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { validateInput } from "../../common/utils/validate.js";
import { createSubcategoryValidate, updateSubcategoryValidate, } from "./subcategory.validate.js";
import { getAllSubcategories, getSubcategoryById, softDeleteSubcategory, createSubcategory, updateSubcategory, getActiveSubcategories, getActiveSubcategoryById, } from "./subcategory.service.js";
const router = Router();
/** Public routes */
router.get("/", getActiveSubcategories);
/** Admin routes — must be registered BEFORE /:id to avoid route conflict */
router.post("/admin", auth, allowRoles("admin", "superAdmin"), validateInput(createSubcategoryValidate), createSubcategory);
router.put("/admin/:id", auth, allowRoles("admin", "superAdmin"), validateInput(updateSubcategoryValidate), updateSubcategory);
router.get("/admin", auth, allowRoles("admin", "superAdmin"), getAllSubcategories);
router.get("/admin/:id", auth, allowRoles("admin", "superAdmin"), getSubcategoryById);
router.delete("/admin/:id", auth, allowRoles("admin", "superAdmin"), softDeleteSubcategory);
/** Public wildcard route — must be after /admin routes */
router.get("/:id", getActiveSubcategoryById);
export default router;
//# sourceMappingURL=subcategory.controller.js.map