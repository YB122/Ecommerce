/** Express app setup: middleware, routes, and global error handler. */
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { env } from "../config/env.service.js";
import authRouter from "./module/auth/auth.controller.js";
import userRouter from "./module/user/user.controller.js";
import session from "express-session";
import passport from "passport";
import { v2 as cloudinary } from "cloudinary";
import wishlistRouter from "./module/wishlist/wishlist.controller.js";
import cartRouter from "./module/cart/cart.controller.js";
import categoryRouter from "./module/category/category.controller.js";
import subcategoryRouter from "./module/subcategory/subcategory.controller.js";
import productRouter from "./module/product/product.controller.js";
import securityRouter from "./module/security/security.controller.js";
import contactRouter from "./module/contact/contact.controller.js";
import orderRouter, {
  webhookRouter,
} from "./module/order/order.controller.js";
import compression from "compression";
import helmet from "helmet";
import { blocklistMiddleware } from "./common/middleware/blocklist.js";

/** Initializes the Express application with middleware and route registrations */
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use(helmet());
app.use(compression());

app.use("/v1/order/webhook", webhookRouter);

app.use((req, res, next) => {
  const ct = req.headers["content-type"] || "";
  if (ct.includes("multipart/form-data")) return next();
  express.json({ limit: "10mb" })(req, res, next);
});

app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

app.use(blocklistMiddleware);

cloudinary.config({
  cloud_name: env.CLOUDINARY_NAME,
  api_key: env.CLOUDINARY_KEY,
  api_secret: env.CLOUDINARY_SECRET,
});

app.use("/v1/auth", authRouter);
app.use("/v1/user", userRouter);
app.use("/v1/category", categoryRouter);
app.use("/v1/subcategory", subcategoryRouter);
app.use("/v1/wishlist", wishlistRouter);
app.use("/v1/cart", cartRouter);
app.use("/v1/products", productRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/security", securityRouter);
app.use("/v1/contact", contactRouter);

/**
 * @desc Global error-handling middleware
 * @param {Error} err - the thrown error object
 * @param {Request} _req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} _next - Express next function
 * @returns {void}
 */
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(" Error:", err?.errors || err.message);
  res
    .status(err.status || 500)
    .json({
      message: err.message || "Internal Server Error",
      errors: err?.errors || undefined,
    });
});

export default app;
