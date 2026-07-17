/** Order routes: create order, list orders, admin status update + Stripe webhook */
import { Router } from "express";
import express from "express";
import { auth } from "../../common/middleware/auth.js";
import { allowRoles } from "../../common/utils/allowRoles.js";
import { validateInput } from "../../common/utils/validate.js";
import { createOrderValidate, updateOrderStatusValidate, } from "./order.validate.js";
import { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, } from "./order.service.js";
import { handleWebhook } from "./stripe.service.js";
import { rateLimiter } from "../../common/utils/rateLimit.js";
const router = Router();
/** User routes */
router.post("/", rateLimiter(60), auth, validateInput(createOrderValidate), createOrder);
router.get("/mine", auth, getMyOrders);
/** Admin routes — must be registered BEFORE /:id to avoid route conflict */
router.get("/admin", auth, allowRoles("admin", "superAdmin"), getAllOrders);
router.patch("/admin/:id", auth, allowRoles("admin", "superAdmin"), validateInput(updateOrderStatusValidate), updateOrderStatus);
/** Public parameterized route — must be after /admin routes */
router.get("/:id", auth, getOrderById);
/**
 * @desc Handle Stripe webhook events (checkout.session.completed)
 * @access Public (Stripe webhook)
 */
const stripeWebhookHandler = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    if (!sig) {
        res.status(400).json({ message: "Missing stripe-signature header" });
        return;
    }
    const result = await handleWebhook(req.body, sig);
    if (!result.received) {
        res.status(400).json({ message: "Webhook error", error: result.error });
        return;
    }
    res.status(200).json({ received: true });
};
/** Stripe webhook router (raw body parser required for signature verification) */
export const webhookRouter = Router();
webhookRouter.post("/", express.raw({ type: "application/json" }), stripeWebhookHandler);
export default router;
//# sourceMappingURL=order.controller.js.map