/** Cart routes: add item, view cart, update quantity, remove item, clear cart */
import { Router } from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { validateInput } from "../../common/utils/validate.js";
import { addCartValidate, updateCartQuantityValidate, } from "./cart.validate.js";
import { addToCart, getCart, updateCartQuantity, removeCartItem, clearCart, } from "./cart.service.js";
const router = Router();
router.use(auth, allowRoles("user"));
/**
 * @route POST /cart
 * @desc Add an item to the cart (or increase quantity if already present)
 * @access User
 * @body { productId: number, quantity: number }
 * @returns { 201 } { message, data: CartItem }
 * @returns { 200 } { message, data: CartItem } (if item already existed, quantity increased)
 * @throws { 400 } Validation error or quantity exceeds stock
 * @throws { 401 } Unauthorized
 * @throws { 404 } Product not found or inactive
 * @throws { 500 } Internal server error
 */
router.post("/", validateInput(addCartValidate), addToCart);
/**
 * @route GET /cart
 * @desc Get all cart items for the authenticated user with subtotals
 * @access User
 * @returns { 200 } { message, data: { items: CartItem[], total: number } }
 * @throws { 401 } Unauthorized
 * @throws { 500 } Internal server error
 */
router.get("/", getCart);
/**
 * @route PUT /cart/:productId
 * @desc Update quantity of a specific cart item
 * @access User
 * @body { quantity: number }
 * @returns { 200 } { message, data: CartItem }
 * @throws { 400 } Validation error or quantity exceeds stock
 * @throws { 401 } Unauthorized
 * @throws { 404 } Item not found in cart
 * @throws { 500 } Internal server error
 */
router.put("/:productId/:color/:size", validateInput(updateCartQuantityValidate), updateCartQuantity);
/**
 * @route DELETE /cart/:productId/:color/:size
 * @desc Remove a specific item from the cart
 * @access User
 * @returns { 200 } { message }
 * @throws { 401 } Unauthorized
 * @throws { 404 } Item not found in cart
 * @throws { 500 } Internal server error
 */
router.delete("/:productId/:color/:size", removeCartItem);
/**
 * @route DELETE /cart
 * @desc Clear all items from the cart
 * @access User
 * @returns { 200 } { message }
 * @throws { 401 } Unauthorized
 * @throws { 500 } Internal server error
 */
router.delete("/", clearCart);
export default router;
//# sourceMappingURL=cart.controller.js.map