/** Security business logic: read and return security.log entries */
import { Request, Response } from "express";
/**
 * @desc Read and return all entries from security.log as parsed JSON array
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {500} Internal server error
 */
export declare const getSecurityLogs: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=security.service.d.ts.map