/** User routes: profile retrieval & update, avatar upload */
import { Router } from "express";
import { getProfile, updateProfile, uploadAvatar } from "./user.service.js";
import { auth } from "../../common/middleware/auth.js";
import { uploadSingle } from "../../common/middleware/multer.js";
import { validateInput } from "../../common/utils/validate.js";
import { updateProfileValidate } from "./user.validate.js";
const router = Router();
/**
 * @route GET /v1/user/profile
 * @desc Get authenticated user's profile
 * @access User
 * @returns { 200 } { message, data: user }
 * @throws { 401 } Unauthorized
 * @throws { 404 } User not found
 */
router.get("/profile", auth, getProfile);
/**
 * @route PUT /v1/user/profile
 * @desc Update authenticated user's profile (phone, avatar)
 * @access User
 * @body { phone?: string } + multipart image (optional)
 * @returns { 200 } { message, data: user }
 * @throws { 400 } Invalid file type / No fields to update
 * @throws { 401 } Unauthorized
 * @throws { 404 } User not found
 */
router.put("/profile", auth, uploadSingle(2, "image"), validateInput(updateProfileValidate), updateProfile);
/**
 * @route POST /v1/user/upload-avatar
 * @desc Upload a new avatar image for the authenticated user
 * @access User
 * @body { image: file } - Multipart image upload
 * @returns { 200 } { message, data: { imageURL } }
 * @throws { 400 } No image provided / Invalid file type
 * @throws { 401 } Unauthorized
 * @throws { 404 } User not found
 */
router.post("/upload-avatar", auth, uploadSingle(2, "image"), uploadAvatar);
export default router;
//# sourceMappingURL=user.controller.js.map