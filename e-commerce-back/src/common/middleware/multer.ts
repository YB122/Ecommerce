/** Multer memory storage configuration with dynamic size limit. */
import multer from "multer";
import type { Request, Response, NextFunction } from "express";

/**
 * @desc Creates a multer middleware instance with memory storage and dynamic size limit
 * @param {number} maxSizeMB - Maximum allowed file size in megabytes
 * @returns {import("multer").Multer} Configured multer middleware
 */
export const upload = (maxSizeMB: number) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: maxSizeMB * 1024 * 1024 },
  });
};

/**
 * @desc Only applies multer middleware if the request is multipart.
 * Skips multer entirely for JSON/form-urlencoded requests to avoid body issues.
 */
export const uploadSingle = (maxSizeMB: number, fieldName: string) => {
  const mw = upload(maxSizeMB).any(); // Use .any() to accept any field name
  return (req: Request, res: Response, next: NextFunction) => {
    const contentType = req.headers["content-type"] || "";
    console.log("[multer] Content-Type:", contentType);
    console.log("[multer] Expected field:", fieldName);
    if (!contentType.includes("multipart/form-data")) {
      console.log("[multer] Not multipart, skipping");
      return next();
    }
    mw(req, res, (err) => {
      const files = (req as any).files || [];
      console.log("[multer] Files received:", files.map((f: any) => ({ fieldname: f.fieldname, originalname: f.originalname })));
      // Find the file with matching field name
      const matchedFile = files.find((f: any) => f.fieldname === fieldName);
      if (matchedFile) {
        (req as any).file = matchedFile;
      }
      console.log("[multer] After multer - file:", req.file ? "YES" : "NO", "body keys:", Object.keys(req.body || {}));
      if (err && (err as any).code === "LIMIT_UNEXPECTED_FILE") return next();
      next(err);
    });
  };
};
