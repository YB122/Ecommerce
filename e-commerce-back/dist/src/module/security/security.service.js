import fs from "fs";
import path from "path";
/**
 * @desc Read and return all entries from security.log as parsed JSON array
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {Promise<void>}
 * @throws {500} Internal server error
 */
export const getSecurityLogs = async (req, res) => {
    try {
        const logPath = path.resolve("security.log");
        if (!fs.existsSync(logPath)) {
            res.status(200).json({ message: "Security logs", data: [] });
            return;
        }
        const raw = fs.readFileSync(logPath, "utf-8").trim();
        if (!raw) {
            res.status(200).json({ message: "Security logs", data: [] });
            return;
        }
        const entries = raw
            .split("\n")
            .filter(Boolean)
            .map((line) => JSON.parse(line));
        res.status(200).json({ message: "Security logs", data: entries });
    }
    catch (error) {
        console.error("Get security logs error:", error?.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
//# sourceMappingURL=security.service.js.map