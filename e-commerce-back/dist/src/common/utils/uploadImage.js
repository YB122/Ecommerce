import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../../../config/env.service.js";
import { verifyFileType } from "./validateImage.js";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");
const isCloudinary = () => env.Image_TYPE === "CLOUDINARY";
const ensureDir = (folder) => {
    const dir = path.join(UPLOADS_DIR, folder);
    if (!fs.existsSync(dir))
        fs.mkdirSync(dir, { recursive: true });
    return dir;
};
export const uploadImage = async (file, folder) => {
    const { isValid, detectedType } = await verifyFileType(file.buffer);
    if (!isValid) {
        throw new Error(`Invalid file type: ${detectedType}. Only JPEG, PNG, GIF, and WebP are allowed.`);
    }
    if (isCloudinary()) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(file.buffer);
        });
        return { url: result.secure_url, id: result.public_id };
    }
    const ext = path.extname(file.originalname) || ".jpg";
    const filename = `${uuidv4()}${ext}`;
    const dir = ensureDir(folder);
    fs.writeFileSync(path.join(dir, filename), file.buffer);
    const baseUrl = env.SERVER?.replace(/\/+$/, "") || "";
    return { url: `${baseUrl}/uploads/${folder}/${filename}`, id: filename };
};
export const uploadImages = async (files, folder) => {
    return Promise.all(files.map((file) => uploadImage(file, folder)));
};
export const deleteImage = async (id, folder) => {
    if (isCloudinary()) {
        await cloudinary.uploader.destroy(id);
        return;
    }
    if (folder) {
        const filePath = path.join(UPLOADS_DIR, folder, path.basename(id));
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    }
};
export const deleteImages = async (ids, folder) => {
    await Promise.all(ids.map((id) => deleteImage(id, folder)));
};
const extractCloudinaryPublicId = (url) => {
    const match = url.match(/\/v\d+\/(.+?)\.\w+$/);
    return match ? match[1] : null;
};
export const deleteImageByUrl = async (url, folder) => {
    if (!url)
        return;
    if (isCloudinary()) {
        const publicId = extractCloudinaryPublicId(url);
        if (publicId)
            await cloudinary.uploader.destroy(publicId);
    }
    else {
        const filename = path.basename(url);
        const filePath = path.join(UPLOADS_DIR, folder, filename);
        if (fs.existsSync(filePath))
            fs.unlinkSync(filePath);
    }
};
export const deleteImagesByUrls = async (urls, folder) => {
    await Promise.all(urls.map((url) => deleteImageByUrl(url, folder)));
};
/** Uploads a base64-encoded image string to the configured image storage */
export const uploadBase64Image = async (base64String, folder) => {
    const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
    if (!matches)
        throw new Error("Invalid base64 image format");
    const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const file = { buffer, originalname: `color.${ext}` };
    return uploadImage(file, folder);
};
//# sourceMappingURL=uploadImage.js.map