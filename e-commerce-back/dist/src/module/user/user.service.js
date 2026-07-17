import { userModel } from "../../database/model/user.model.js";
import { uploadImage, deleteImageByUrl } from "../../common/utils/uploadImage.js";
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await userModel.findById(userId).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "Profile", data: user });
    }
    catch (error) {
        console.error("Get profile error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        if (req.body.phone) {
            user.phone = req.body.phone.startsWith("+")
                ? req.body.phone
                : `+${req.body.phone}`;
        }
        if (req.file) {
            try {
                if (user.imageURL) {
                    await deleteImageByUrl(user.imageURL, "profiles");
                }
                const result = await uploadImage(req.file, "profiles");
                user.imageURL = result.url;
            }
            catch (err) {
                res.status(400).json({ message: err.message });
                return;
            }
        }
        await user.save();
        res.status(200).json({ message: "Profile updated", data: user });
    }
    catch (error) {
        console.error("Update profile error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        if (!req.file) {
            res.status(400).json({ message: "No image provided" });
            return;
        }
        const user = await userModel.findById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        try {
            if (user.imageURL) {
                await deleteImageByUrl(user.imageURL, "profiles");
            }
            const result = await uploadImage(req.file, "profiles");
            user.imageURL = result.url;
            const saved = await user.save();
            console.log("[uploadAvatar] saved imageURL:", saved.imageURL);
            res.status(200).json({ message: "Avatar uploaded", data: { imageURL: result.url } });
        }
        catch (err) {
            res.status(400).json({ message: err.message });
            return;
        }
    }
    catch (error) {
        console.error("Upload avatar error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=user.service.js.map