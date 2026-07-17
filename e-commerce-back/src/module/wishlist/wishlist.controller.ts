/** Wishlist routes: add, list, remove items */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "./wishlist.service.js";

const router = Router();

router.use(auth, allowRoles("user"));

/**
 * @route POST /wishlist/:productId
 * @desc Add a product to the wishlist (duplicates prevented)
 * @access User
 * @returns { 201 } { message, data: WishlistItem }
 * @throws { 400 } Product already in wishlist
 * @throws { 401 } Unauthorized
 * @throws { 404 } Product not found or inactive
 * @throws { 500 } Internal server error
 */
router.post("/:productId", addToWishlist);
/**
 * @route GET /wishlist
 * @desc Get all wishlist items for the authenticated user
 * @access User
 * @returns { 200 } { message, data: WishlistItem[] }
 * @throws { 401 } Unauthorized
 * @throws { 500 } Internal server error
 */
router.get("/", getWishlist);
/**
 * @route DELETE /wishlist/:productId
 * @desc Remove a product from the wishlist
 * @access User
 * @returns { 200 } { message }
 * @throws { 401 } Unauthorized
 * @throws { 404 } Item not found in wishlist
 * @throws { 500 } Internal server error
 */
router.delete("/:productId", removeFromWishlist);

export default router;
