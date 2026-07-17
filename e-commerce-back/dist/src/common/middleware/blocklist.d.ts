/** Middleware that checks Redis for blocked IPs and rejects blocked requests. */
import { Request, Response, NextFunction } from "express";
/**
 * @route Any
 * @desc Checks if the request IP is in the Redis blocklist; returns 403 if blocked
 * @access Public
 * @throws { 403 } IP is permanently blocked
 * @success { 200 } Proceeds to next middleware if IP is not blocked
 */
export declare const blocklistMiddleware: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=blocklist.d.ts.map