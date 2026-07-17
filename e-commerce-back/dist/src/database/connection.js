/** Mongoose connection setup. */
import mongoose from "mongoose";
import { env } from "../../config/env.service.js";
/**
 * @desc Connects to MongoDB, then loads model associations.
 * @returns {Promise<void>}
 */
export const dataBaseConnection = async () => {
    try {
        await mongoose.connect(env.MONGODB_URI, {
            serverSelectionTimeoutMS: 3000,
            connectTimeoutMS: 3000,
        });
        console.log("database connected");
    }
    catch (err) {
        console.error("database connection failed:", err?.message);
    }
};
//# sourceMappingURL=connection.js.map