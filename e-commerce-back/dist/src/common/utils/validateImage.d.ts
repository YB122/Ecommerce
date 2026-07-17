/**
 * @desc Reads a file buffer and checks whether its MIME type is among the allowed image types (JPEG, PNG, GIF, WebP)
 * @param {Buffer} buffer - Raw file buffer to inspect
 * @returns {Promise<{ isValid: boolean; detectedType: string | null; expectedType: string }>}
 *          Object indicating whether the file is valid, the detected MIME type, and the list of expected types
 */
export declare const verifyFileType: (buffer: Buffer) => Promise<{
    isValid: boolean;
    detectedType: string | null;
    expectedType: string;
}>;
//# sourceMappingURL=validateImage.d.ts.map