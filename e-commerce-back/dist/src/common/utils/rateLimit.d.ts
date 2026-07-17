/**
 * @desc Creates an express-rate-limit middleware allowing 1 request per given time window
 * @param {number} seconds - Length of the rate-limit window in seconds
 * @returns {import("express-rate-limit").RateLimitRequestHandler} Rate-limiting middleware
 */
export declare const rateLimiter: (seconds: number) => import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimit.d.ts.map