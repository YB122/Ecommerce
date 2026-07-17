/** Winston logger configured for security.log with Egypt timezone. */
import winston from "winston";

/**
 * @desc Winston format transform that attaches a Cairo-timezone timestamp to each log entry
 * @param {winston.Logform.TransformableInfo} info - Log info object to enrich
 * @returns {winston.Logform.TransformableInfo} The enriched log info with timestamp
 */
const egyptTimeFormat = winston.format((info) => {
  const egyptTime = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());

  const [month, day, year, hour, minute, second] = egyptTime.split(/[/, :]/);
  info.timestamp = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
  return info;
});

/**
 * @desc Winston logger instance writing warnings+ to console and security.log
 */
const logger = winston.createLogger({
  level: "warn",
  format: winston.format.combine(egyptTimeFormat(), winston.format.json()),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "security.log",
      level: "warn",
    }),
  ],
});

export default logger;
