/** Order business logic: creation with stock deduction, shipping cost, status management */
import { Request, Response } from "express";
import mongoose from "mongoose";
import { orderModel } from "../../database/model/order.model.js";
import { productModel } from "../../database/model/product.model.js";
import { env } from "../../../config/env.service.js";
import { createCheckoutSession } from "./stripe.service.js";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const dbSession = await mongoose.startSession();
  try {
    dbSession.startTransaction();
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { items, paymentMethod, shippingAddress } = req.body;

    const orderItems: {
      productId: string;
      quantity: number;
      price: number;
      en_name: string;
      ar_name?: string | null;
      fr_name?: string | null;
      color: string;
      size: string;
    }[] = [];

    for (const item of items) {
      const product = await productModel.findById(item.productId).session(dbSession);
      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      const variants: { color: string; size: string; stock: number }[] = product.variants ? JSON.parse(product.variants) : [];
      const variantIdx = variants.findIndex((v) => v.color === item.color && v.size === item.size);
      if (variantIdx === -1) {
        throw new Error(`Variant ${item.color}/${item.size} not found for ${product.en_name}`);
      }
      if (variants[variantIdx].stock < item.quantity) {
        throw new Error(
          `Insufficient stock for ${product.en_name} (${item.color}/${item.size}). Available: ${variants[variantIdx].stock}, requested: ${item.quantity}`,
        );
      }

      const discountedPrice =
        product.discount > 0
          ? Number(product.price) - (Number(product.price) * product.discount) / 100
          : Number(product.price);

      variants[variantIdx].stock -= item.quantity;

      orderItems.push({
        productId: product._id.toString(),
        quantity: item.quantity,
        price: Math.round(discountedPrice * 100) / 100,
        en_name: product.en_name,
        ar_name: product.ar_name,
        fr_name: product.fr_name,
        color: item.color,
        size: item.size,
      });

      product.variants = JSON.stringify(variants);
      await product.save({ session: dbSession });
    }

    const totalAmount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let shippingCost = 0;
    if (paymentMethod === "cod") {
      const costType = env.SHIPPING_COST_TYPE || "fixed";
      const costValue = Number(env.SHIPPING_COST_VALUE) || 0;
      shippingCost =
        costType === "percentage"
          ? Math.round(((totalAmount * costValue) / 100) * 100) / 100
          : costValue;
    }

    const grandTotal = Math.round((totalAmount + shippingCost) * 100) / 100;

    const order = await orderModel.create(
      [{
        userId,
        items: JSON.stringify(orderItems),
        totalAmount: grandTotal,
        shippingCost,
        paymentMethod,
        paymentStatus: "pending",
        orderStatus: "pending",
        shippingAddress: JSON.stringify(shippingAddress),
      }],
      { session: dbSession },
    );

    if (paymentMethod === "card") {
      const session = await createCheckoutSession(
        String(order[0]._id),
        grandTotal,
        orderItems.map(({ productId: _p, ...rest }) => rest),
      );
      if (!session) {
        throw new Error("Failed to create payment session");
      }
      await dbSession.commitTransaction();
      res.status(201).json({
        message: "Redirect to payment",
        data: { url: session.url, orderId: order[0]._id },
      });
      return;
    }

    await dbSession.commitTransaction();
    res.status(201).json({
      message: "Order created",
      data: {
        ...order[0].toJSON(),
        items: orderItems,
        shippingAddress,
        currency: env.CURRENCY,
      },
    });
  } catch (error: any) {
    await dbSession.abortTransaction();
    console.error("Create order error:", error?.message);
    res.status(500).json({ message: error?.message || "Internal server error" });
  } finally {
    dbSession.endSession();
  }
};

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      message: "Orders",
      data: {
        orders: orders.map((o) => ({
          ...o.toJSON(),
          items: JSON.parse(o.items),
          shippingAddress: JSON.parse(o.shippingAddress),
        })),
        currency: env.CURRENCY,
      },
    });
  } catch (error: any) {
    console.error("Get orders error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const orderId = req.params.id as string;

    const order = await orderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (
      String(order.userId) !== String(userId) &&
      req.bearer !== "admin" &&
      req.bearer !== "superAdmin"
    ) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    res.status(200).json({
      message: "Order",
      data: {
        ...order.toJSON(),
        items: JSON.parse(order.items),
        shippingAddress: JSON.parse(order.shippingAddress),
        currency: env.CURRENCY,
      },
    });
  } catch (error: any) {
    console.error("Get order error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const orders = await orderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Orders",
      data: {
        orders: orders.map((o) => ({
          ...o.toJSON(),
          items: JSON.parse(o.items),
          shippingAddress: JSON.parse(o.shippingAddress),
        })),
        currency: env.CURRENCY,
      },
    });
  } catch (error: any) {
    console.error("Get all orders error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const orderId = req.params.id as string;
    const { orderStatus, paymentStatus } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      res.status(404).json({ message: "Order not found" });
      return;
    }

    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    await order.save();

    res.status(200).json({
      message: "Order updated",
      data: {
        ...order.toJSON(),
        items: JSON.parse(order.items),
        shippingAddress: JSON.parse(order.shippingAddress),
        currency: env.CURRENCY,
      },
    });
  } catch (error: any) {
    console.error("Update order error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
