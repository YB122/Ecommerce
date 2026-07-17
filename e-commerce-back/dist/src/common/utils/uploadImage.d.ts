export declare const uploadImage: (file: Express.Multer.File, folder: string) => Promise<{
    url: string;
    id: string;
}>;
export declare const uploadImages: (files: Express.Multer.File[], folder: string) => Promise<{
    url: string;
    id: string;
}[]>;
export declare const deleteImage: (id: string, folder?: string) => Promise<void>;
export declare const deleteImages: (ids: string[], folder?: string) => Promise<void>;
export declare const deleteImageByUrl: (url: string, folder: string) => Promise<void>;
export declare const deleteImagesByUrls: (urls: string[], folder: string) => Promise<void>;
/** Uploads a base64-encoded image string to the configured image storage */
export declare const uploadBase64Image: (base64String: string, folder: string) => Promise<{
    url: string;
    id: string;
}>;
//# sourceMappingURL=uploadImage.d.ts.map