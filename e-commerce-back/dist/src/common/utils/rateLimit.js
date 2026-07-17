/** Rate limiting middleware using express-rate-limit (e.g. 1 request per N seconds). */
import rateLimit from "express-rate-limit";
/**
 * @desc Creates an express-rate-limit middleware allowing 1 request per given time window
 * @param {number} seconds - Length of the rate-limit window in seconds
 * @returns {import("express-rate-limit").RateLimitRequestHandler} Rate-limiting middleware
 */
export const rateLimiter = (seconds) => rateLimit({
    windowMs: seconds * 1000,
    max: 1,
    message: { message: `Too many requests. Try again after ${seconds}s` },
});
//# sourceMappingURL=rateLimit.js.map