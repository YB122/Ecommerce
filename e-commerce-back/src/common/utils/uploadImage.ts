import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "../../../config/env.service.js";
import { verifyFileType } from "./validateImage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../../uploads");

const isCloudinary = (): boolean => env.Image_TYPE === "CLOUDINARY";

const ensureDir = (folder: string): string => {
  const dir = path.join(UPLOADS_DIR, folder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
};

export const uploadImage = async (
  file: Express.Multer.File,
  folder: string,
): Promise<{ url: string; id: string }> => {
  const { isValid, detectedType } = await verifyFileType(file.buffer);
  if (!isValid) {
    throw new Error(
      `Invalid file type: ${detectedType}. Only JPEG, PNG, GIF, and WebP are allowed.`,
    );
  }

  if (isCloudinary()) {
    const result = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
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

export const uploadImages = async (
  files: Express.Multer.File[],
  folder: string,
): Promise<{ url: string; id: string }[]> => {
  return Promise.all(files.map((file) => uploadImage(file, folder)));
};

export const deleteImage = async (id: string, folder?: string): Promise<void> => {
  if (isCloudinary()) {
    await cloudinary.uploader.destroy(id);
    return;
  }
  if (folder) {
    const filePath = path.join(UPLOADS_DIR, folder, path.basename(id));
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

export const deleteImages = async (
  ids: string[],
  folder?: string,
): Promise<void> => {
  await Promise.all(ids.map((id) => deleteImage(id, folder)));
};

const extractCloudinaryPublicId = (url: string): string | null => {
  const match = url.match(/\/v\d+\/(.+?)\.\w+$/);
  return match ? match[1] : null;
};

export const deleteImageByUrl = async (url: string, folder: string): Promise<void> => {
  if (!url) return;
  if (isCloudinary()) {
    const publicId = extractCloudinaryPublicId(url);
    if (publicId) await cloudinary.uploader.destroy(publicId);
  } else {
    const filename = path.basename(url);
    const filePath = path.join(UPLOADS_DIR, folder, filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};

export const deleteImagesByUrls = async (urls: string[], folder: string): Promise<void> => {
  await Promise.all(urls.map((url) => deleteImageByUrl(url, folder)));
};

/** Uploads a base64-encoded image string to the configured image storage */
export const uploadBase64Image = async (
  base64String: string,
  folder: string,
): Promise<{ url: string; id: string }> => {
  const matches = base64String.match(/^data:image\/(\w+);base64,(.+)$/);
  if (!matches) throw new Error("Invalid base64 image format");
  const ext = matches[1] === "jpeg" ? "jpg" : matches[1];
  const buffer = Buffer.from(matches[2], "base64");
  const file = { buffer, originalname: `color.${ext}` } as Express.Multer.File;
  return uploadImage(file, folder);
};
