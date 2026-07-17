import { wishlistModel } from "../../database/model/wishlist.model.js";
import { productModel } from "../../database/model/product.model.js";
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params.productId;
        const product = await productModel.findOne({ _id: productId, isActive: true });
        if (!product) {
            res.status(404).json({ message: "Product not found or inactive" });
            return;
        }
        const existing = await wishlistModel.findOne({ userId, productId });
        if (existing) {
            res.status(400).json({ message: "Product already in wishlist" });
            return;
        }
        const item = await wishlistModel.create({ userId, productId });
        res.status(201).json({ message: "Added to wishlist", data: item });
    }
    catch (error) {
        console.error("Add to wishlist error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user?._id;
        const items = await wishlistModel.find({ userId }).populate({
            path: "productId",
            select: "id en_name ar_name fr_name price discount imageURLs",
        });
        res.status(200).json({ message: "Wishlist", data: items });
    }
    catch (error) {
        console.error("Get wishlist error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user?._id;
        const productId = req.params.productId;
        const item = await wishlistModel.findOne({ userId, productId: productId });
        if (!item) {
            res.status(404).json({ message: "Item not found in wishlist" });
            return;
        }
        await item.deleteOne();
        res.status(200).json({ message: "Removed from wishlist" });
    }
    catch (error) {
        console.error("Remove from wishlist error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=wishlist.service.js.map