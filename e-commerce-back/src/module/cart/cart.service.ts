/** Cart business logic: CRUD with variant stock validation and subtotal calculation */
import { Request, Response } from "express";
import { cartModel } from "../../database/model/cart.model.js";
import { productModel } from "../../database/model/product.model.js";
import { env } from "../../../config/env.service.js";
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const { productId, color, size, quantity } = req.body;

    const product = await productModel.findOne({ _id: productId, isActive: true });
    if (!product) {
      res.status(404).json({ message: "Product not found or inactive" });
      return;
    }

    const variants: { color: string; size: string; stock: number }[] = product.variants ? JSON.parse(product.variants) : [];
    const variant = variants.find((v) => v.color === color && v.size === size);
    if (!variant) {
      res.status(400).json({ message: `Variant ${color}/${size} not found for this product` });
      return;
    }
    if (quantity > variant.stock) {
      res.status(400).json({
        message: `Requested quantity exceeds stock. Available: ${variant.stock} for ${color}/${size}`,
      });
      return;
    }

    const existing = await cartModel.findOne({ userId, productId, color, size });
    if (existing) {
      const total = existing.quantity + quantity;
      if (total > variant.stock) {
        res.status(400).json({
          message: `Total quantity would exceed stock (${variant.stock} available for ${color}/${size})`,
        });
        return;
      }
      existing.quantity = total;
      await existing.save();
      res.status(200).json({ message: "Cart updated", data: existing });
      return;
    }

    const cartItem = await cartModel.create({ userId, productId, color, size, quantity });
    res.status(201).json({ message: "Item added to cart", data: cartItem });
  } catch (error: any) {
    console.error("Add to cart error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const items = await cartModel.find({ userId }).populate({
      path: "productId",
      select: "id en_name ar_name fr_name price discount variants imageURLs",
    });

    let subtotal = 0;
    const data = items.map((item: any) => {
      const price = Number(item.productId?.price || 0);
      const discount = item.productId?.discount || 0;
      const discountedPrice = price - (price * discount) / 100;
      const itemSubtotal = discountedPrice * item.quantity;
      subtotal += itemSubtotal;
      return {
        _id: item._id,
        productId: item.productId?._id,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        product: item.productId,
        subtotal: itemSubtotal,
      };
    });

    const shippingCostType = env.SHIPPING_COST_TYPE || "fixed";
    const shippingCostValue = Number(env.SHIPPING_COST_VALUE) || 0;
    const shippingCost =
      shippingCostType === "percentage"
        ? Math.round(subtotal * shippingCostValue) / 100
        : shippingCostValue;
    const total = Math.round((subtotal + shippingCost) * 100) / 100;

    res.status(200).json({ message: "Cart", data: { items: data, subtotal, shippingCost, total, currency: env.CURRENCY } });
  } catch (error: any) {
    console.error("Get cart error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateCartQuantity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId as string;
    const color = req.params.color as string;
    const size = req.params.size as string;
    const { quantity } = req.body;

    const item = await cartModel.findOne({ userId, productId, color, size });
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    const product = await productModel.findById(productId);
    if (!product || !product.isActive) {
      res.status(400).json({ message: "Product is no longer available" });
      return;
    }

    const variants: { color: string; size: string; stock: number }[] = product.variants ? JSON.parse(product.variants) : [];
    const variant = variants.find((v) => v.color === color && v.size === size);
    if (!variant) {
      res.status(400).json({ message: `Variant ${color}/${size} no longer exists` });
      return;
    }
    if (quantity > variant.stock) {
      res.status(400).json({
        message: `Requested quantity exceeds stock (${variant.stock} available for ${color}/${size})`,
      });
      return;
    }

    item.quantity = quantity;
    await item.save();
    res.status(200).json({ message: "Cart updated", data: item });
  } catch (error: any) {
    console.error("Update cart quantity error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const productId = req.params.productId as string;
    const color = req.params.color as string;
    const size = req.params.size as string;

    const item = await cartModel.findOne({ userId, productId, color, size });
    if (!item) {
      res.status(404).json({ message: "Item not found in cart" });
      return;
    }

    await item.deleteOne();
    res.status(200).json({ message: "Item removed from cart" });
  } catch (error: any) {
    console.error("Remove cart item error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const clearCart = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    await cartModel.deleteMany({ userId });
    res.status(200).json({ message: "Cart cleared" });
  } catch (error: any) {
    console.error("Clear cart error:", error?.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
