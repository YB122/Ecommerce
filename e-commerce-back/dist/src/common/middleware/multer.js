/** Multer memory storage configuration with dynamic size limit. */
import multer from "multer";
/**
 * @desc Creates a multer middleware instance with memory storage and dynamic size limit
 * @param {number} maxSizeMB - Maximum allowed file size in megabytes
 * @returns {import("multer").Multer} Configured multer middleware
 */
export const upload = (maxSizeMB) => {
    return multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: maxSizeMB * 1024 * 1024 },
    });
};
/**
 * @desc Only applies multer middleware if the request is multipart.
 * Skips multer entirely for JSON/form-urlencoded requests to avoid body issues.
 */
export const uploadSingle = (maxSizeMB, fieldName) => {
    const mw = upload(maxSizeMB).any(); // Use .any() to accept any field name
    return (req, res, next) => {
        const contentType = req.headers["content-type"] || "";
        console.log("[multer] Content-Type:", contentType);
        console.log("[multer] Expected field:", fieldName);
        if (!contentType.includes("multipart/form-data")) {
            console.log("[multer] Not multipart, skipping");
            return next();
        }
        mw(req, res, (err) => {
            const files = req.files || [];
            console.log("[multer] Files received:", files.map((f) => ({ fieldname: f.fieldname, originalname: f.originalname })));
            // Find the file with matching field name
            const matchedFile = files.find((f) => f.fieldname === fieldName);
            if (matchedFile) {
                req.file = matchedFile;
            }
            console.log("[multer] After multer - file:", req.file ? "YES" : "NO", "body keys:", Object.keys(req.body || {}));
            if (err && err.code === "LIMIT_UNEXPECTED_FILE")
                return next();
            next(err);
        });
    };
};
//# sourceMappingURL=multer.js.map