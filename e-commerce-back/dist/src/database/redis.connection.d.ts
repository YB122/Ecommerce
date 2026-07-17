/** Redis client connection (used for OTP, blocking, etc.). */
import { createClient } from "redis";
/** Returns the Redis client, connecting lazily on first call */
export declare const getClient: () => Promise<ReturnType<typeof createClient>>;
//# sourceMappingURL=redis.connection.d.ts.map