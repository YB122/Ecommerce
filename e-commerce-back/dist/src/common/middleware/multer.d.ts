/** Multer memory storage configuration with dynamic size limit. */
import multer from "multer";
import type { Request, Response, NextFunction } from "express";
/**
 * @desc Creates a multer middleware instance with memory storage and dynamic size limit
 * @param {number} maxSizeMB - Maximum allowed file size in megabytes
 * @returns {import("multer").Multer} Configured multer middleware
 */
export declare const upload: (maxSizeMB: number) => multer.Multer;
/**
 * @desc Only applies multer middleware if the request is multipart.
 * Skips multer entirely for JSON/form-urlencoded requests to avoid body issues.
 */
export declare const uploadSingle: (maxSizeMB: number, fieldName: string) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=multer.d.ts.map