/** Product routes: public listing with filter/sort/pagination + admin CRUD with multi-image upload */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { upload } from "../../common/middleware/multer.js";
import { validateInput } from "../../common/utils/validate.js";
import { createProductValidate, updateProductValidate, } from "./product.validate.js";
import { getAllProducts, getProductById, softDeleteProduct, getActiveProducts, getActiveProductById, getProductsByCategory, getProductsBySubcategory, createProduct, updateProduct, } from "./product.service.js";
const router = Router();
/**
 * @route POST /products/admin
 * @desc Create a new product with multi-image upload
 * @access Admin | SuperAdmin
 * @body { en_name: string, en_description: string, ar_name?: string, fr_name?: string, ar_description?: string, fr_description?: string, price: number, discount?: number, stock?: number, subcategoryId: number, images?: file[] }
 * @success { 201 } Product created
 * @throws { 400 } Product already exists or invalid file type
 * @throws { 401 } Unauthorized
 * @throws { 404 } Subcategory not found
 * @throws { 500 } Internal server error
 */
router.post("/admin", auth, allowRoles("admin", "superAdmin"), upload(2).array("images", 5), validateInput(createProductValidate), createProduct);
/**
 * @route PUT /products/admin/:id
 * @desc Update a product with optional multi-image replacement
 * @access Admin | SuperAdmin
 * @body { en_name?: string, en_description?: string, ar_name?: string, fr_name?: string, ar_description?: string, fr_description?: string, price?: number, discount?: number, stock?: number, subcategoryId?: number, imageURLs?: string, images?: file[] }
 * @success { 200 } Product updated
 * @throws { 400 } Product name already exists or no fields to update
 * @throws { 404 } Product or subcategory not found
 * @throws { 500 } Internal server error
 */
router.put("/admin/:id", auth, allowRoles("admin", "superAdmin"), upload(10).array("images", 5), validateInput(updateProductValidate), updateProduct);
/**
 * @route GET /products/admin
 * @desc Get all products (including inactive)
 * @access Admin | SuperAdmin
 * @success { 200 } Products list
 * @throws { 404 } No products found
 * @throws { 500 } Internal server error
 */
router.get("/admin", auth, allowRoles("admin", "superAdmin"), getAllProducts);
/**
 * @route GET /products/admin/:id
 * @desc Get a product by ID (including inactive)
 * @access Admin | SuperAdmin
 * @success { 200 } Product data
 * @throws { 404 } Product not found
 * @throws { 500 } Internal server error
 */
router.get("/admin/:id", auth, allowRoles("admin", "superAdmin"), getProductById);
/**
 * @route DELETE /products/admin/:id
 * @desc Soft delete a product
 * @access Admin | SuperAdmin
 * @success { 200 } Product soft deleted
 * @throws { 404 } Product not found
 * @throws { 500 } Internal server error
 */
router.delete("/admin/:id", auth, allowRoles("admin", "superAdmin"), softDeleteProduct);
/**
 * @route GET /products/category/:categoryId
 * @desc Get active products by category with filter, sort, and pagination
 * @access Public
 * @query { page?: number, limit?: number, minPrice?: number, maxPrice?: number, sort?: string }
 * @success { 200 } Products list with pagination
 * @throws { 400 } Invalid query parameters
 * @throws { 500 } Internal server error
 */
router.get("/category/:categoryId", getProductsByCategory);
/**
 * @route GET /products/subcategory/:subcategoryId
 * @desc Get active products by subcategory with filter, sort, and pagination
 * @access Public
 * @query { page?: number, limit?: number, minPrice?: number, maxPrice?: number, sort?: string }
 * @success { 200 } Products list with pagination
 * @throws { 400 } Invalid query parameters
 * @throws { 500 } Internal server error
 */
router.get("/subcategory/:subcategoryId", getProductsBySubcategory);
/**
 * @route GET /products
 * @desc List active products with filter, sort, and pagination
 * @access Public
 * @query { page?: number, limit?: number, minPrice?: number, maxPrice?: number, sort?: string }
 * @success { 200 } Products list with pagination
 * @throws { 400 } Invalid query parameters
 * @throws { 500 } Internal server error
 */
router.get("/", getActiveProducts);
/**
 * @route GET /products/:id
 * @desc Get an active product by ID
 * @access Public
 * @success { 200 } Product data
 * @throws { 404 } Product not found
 * @throws { 500 } Internal server error
 */
router.get("/:id", getActiveProductById);
export default router;
//# sourceMappingURL=product.controller.js.map