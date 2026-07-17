/** Shape of validated environment variables loaded from config/.env */
interface Env {
    port: string | undefined;
    email: string | undefined;
    password: string | undefined;
    hash: string | undefined;
    base_url: string | undefined;
    signatureAdmin: string | undefined;
    signatureUser: string | undefined;
    accessToken: string | undefined;
    refreshToken: string | undefined;
    verifySignature: string | undefined;
    GOOGLE_CLIENT_ID: string | undefined;
    GOOGLE_CLIENT_SECRET: string | undefined;
    CLOUDINARY_NAME: string | undefined;
    CLOUDINARY_KEY: string | undefined;
    CLOUDINARY_SECRET: string | undefined;
    MONGODB_URI: string | undefined;
    SIGNATURE_SUPER_ADMIN: string | undefined;
    REDIS_URL: string | undefined;
    SHIPPING_COST_TYPE: string | undefined;
    SHIPPING_COST_VALUE: string | undefined;
    Publishable_key_Stripe: string | undefined;
    Secret_key_Stripe: string | undefined;
    STRIPE_WEBHOOK_SECRET: string | undefined;
    CURRENCY: string | undefined;
    Image_TYPE: string | undefined;
    SERVER: string | undefined;
}
/** Aggregated environment variables object containing all app configuration */
export declare const env: Env;
export {};
//# sourceMappingURL=env.service.d.ts.map