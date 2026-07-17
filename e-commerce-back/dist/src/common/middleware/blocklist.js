import { getClient } from "../../database/redis.connection.js";
/**
 * @route Any
 * @desc Checks if the request IP is in the Redis blocklist; returns 403 if blocked
 * @access Public
 * @throws { 403 } IP is permanently blocked
 * @success { 200 } Proceeds to next middleware if IP is not blocked
 */
export const blocklistMiddleware = async (req, res, next) => {
    const ip = req.ip;
    if (!ip) {
        next();
        return;
    }
    try {
        const redis = await getClient().catch(() => null);
        const blocked = redis ? await redis.get(`blocked:${ip}`) : null;
        if (blocked) {
            res.status(403).json({ message: "Access denied. IP is permanently blocked." });
            return;
        }
    }
    catch {
        // Redis unavailable — allow request through
    }
    next();
};
//# sourceMappingURL=blocklist.js.map