/** Sequelize model associations (foreign keys, relations). */
import { cartModel } from "./model/cart.model.js";
import { categoryModel } from "./model/category.model.js";
import { productModel } from "./model/product.model.js";
import { subcategoryModel } from "./model/subcategory.model.js";
import { wishlistModel } from "./model/wishlist.model.js";
categoryModel.hasMany(subcategoryModel, { foreignKey: "categoryId" });
subcategoryModel.belongsTo(categoryModel, { foreignKey: "categoryId" });
subcategoryModel.hasMany(productModel, { foreignKey: "subcategoryId" });
productModel.belongsTo(subcategoryModel, { foreignKey: "subcategoryId" });
productModel.hasMany(cartModel, { foreignKey: "productId" });
cartModel.belongsTo(productModel, { foreignKey: "productId" });
productModel.hasMany(wishlistModel, { foreignKey: "productId" });
wishlistModel.belongsTo(productModel, { foreignKey: "productId" });
//# sourceMappingURL=association.js.map