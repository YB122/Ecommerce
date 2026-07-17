/** Joi custom validator that detects SQL/NoSQL injection attempts in string inputs. */
import Joi from "joi";
import logger from "./logger.js";
import { getClient } from "../../database/redis.connection.js";

/**
 * @desc Returns the current date/time formatted as ISO-like string in Africa/Cairo timezone
 * @returns {string} Timestamp string in YYYY-MM-DDTHH:mm:ss format
 */
const getEgyptTime = (): string => {
  const now = new Date();
  const egyptTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
  const [month, day, year, hour, minute, second] = egyptTime.split(/[/, :]/);
  return `${year}-${month}-${day}T${hour}:${minute}:${second}`;
};

/**
 * @desc Custom Joi validator that scans string inputs for SQL/NoSQL injection patterns.
 *       On detection, logs a security alert and permanently blocks the source IP via Redis.
 * @param {string} value - The string value to validate
 * @param {Joi.CustomHelpers} helpers - Joi helpers providing access to context (ipAddress)
 * @returns {string} The original value if safe
 * @throws {Joi.ValidationError} Error code "string.injection" if suspicious patterns are found
 */
const detectInjection = (value: string, helpers: Joi.CustomHelpers): string => {
  if (typeof value !== "string") return value;
  const suspiciousPatterns = [
    /\$ne/i,
    /\$eq/i,
    /\$gt/i,
    /\$lt/i,
    /\$regex/i,
    /--/,
    /;/,
    /DROP/i,
    /UNION/i,
    /SELECT/i,
    /INSERT/i,
    /UPDATE/i,
    /DELETE/i,
  ];
  const isSuspicious = suspiciousPatterns.some((pattern) =>
    pattern.test(value),
  );
  if (isSuspicious) {
    const ipAddress =
      (helpers as any)?.context?.ipAddress || "unknown";
    const logMessage = {
      timestamp: getEgyptTime(),
      timeZone: "Africa/Cairo",
      ipAddress,
      type: "SECURITY_ALERT" as const,
      potentialInjection: value,
      message: "Possible injection attempt detected",
    };
    if (logger && typeof logger.warn === "function") {
      logger.warn(logMessage);
    } else {
      console.log("[SECURITY_ALERT]", JSON.stringify(logMessage));
    }

    if (ipAddress && ipAddress !== "unknown") {
      getClient().then(c => c.set(`blocked:${ipAddress}`, "true")).catch(() => {});
    }

    return helpers.error("string.injection", { value }) as unknown as string;
  }
  return value;
};

export default detectInjection;
