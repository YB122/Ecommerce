/** Loads and exports environment variables from config/.env. */
import dotenv from "dotenv";
dotenv.config({ path: "./config/.env" });
const port = process.env.PORT;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const hash = process.env.HASH;
const base_url = process.env.BASE_URL;
const signatureAdmin = process.env.SIGNATURE_ADMIN;
const signatureUser = process.env.SIGNATURE_USER;
const accessToken = process.env.ACCESS_TOKEN;
const refreshToken = process.env.REFRESH_TOKEN;
const verifySignature = process.env.VERIFY_SIGNATURE_MY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CLOUDINARY_NAME = process.env.CLOUDINARY_NAME;
const CLOUDINARY_KEY = process.env.CLOUDINARY_KEY;
const CLOUDINARY_SECRET = process.env.CLOUDINARY_SECRET;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/e-commerce";
const SIGNATURE_SUPER_ADMIN = process.env.SIGNATURE_SUPER_ADMIN;
const REDIS_URL = process.env.REDIS_URL;
const SHIPPING_COST_TYPE = process.env.SHIPPING_COST_TYPE;
const SHIPPING_COST_VALUE = process.env.SHIPPING_COST_VALUE;
const Publishable_key_Stripe = process.env.Publishable_key_Stripe;
const Secret_key_Stripe = process.env.Secret_key_Stripe;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const CURRENCY = process.env.CURRENCY || "EGP";
const Image_TYPE = process.env.Image_TYPE || "CLOUDINARY";
const SERVER = process.env.SERVER || "";
/** Aggregated environment variables object containing all app configuration */
export const env = {
    port,
    email,
    password,
    hash,
    base_url,
    signatureAdmin,
    signatureUser,
    accessToken,
    refreshToken,
    MONGODB_URI,
    verifySignature,
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    CLOUDINARY_NAME,
    CLOUDINARY_KEY,
    CLOUDINARY_SECRET,
    SIGNATURE_SUPER_ADMIN,
    REDIS_URL,
    SHIPPING_COST_TYPE,
    SHIPPING_COST_VALUE,
    Publishable_key_Stripe,
    Secret_key_Stripe,
    STRIPE_WEBHOOK_SECRET,
    CURRENCY,
    Image_TYPE,
    SERVER,
};
//# sourceMappingURL=env.service.js.map