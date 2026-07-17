/** Verifies uploaded file is a valid image type using the file-type package. */
const ALLOWED_IMAGE_MIMES = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];
/**
 * @desc Reads a file buffer and checks whether its MIME type is among the allowed image types (JPEG, PNG, GIF, WebP)
 * @param {Buffer} buffer - Raw file buffer to inspect
 * @returns {Promise<{ isValid: boolean; detectedType: string | null; expectedType: string }>}
 *          Object indicating whether the file is valid, the detected MIME type, and the list of expected types
 */
export const verifyFileType = async (buffer) => {
    const { fileTypeFromBuffer } = await import("file-type");
    const detected = await fileTypeFromBuffer(buffer);
    return {
        isValid: detected ? ALLOWED_IMAGE_MIMES.includes(detected.mime) : false,
        detectedType: detected?.mime ?? "unknown",
        expectedType: ALLOWED_IMAGE_MIMES.join(", "),
    };
};
//# sourceMappingURL=validateImage.js.map