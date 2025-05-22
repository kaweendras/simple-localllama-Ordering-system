import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logDirectory = path.join(__dirname, "../logs");

// Ensure the logs directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDirectory, "logs.txt") }),
    new transports.File({
      filename: path.join(logDirectory, "error.log"),
      level: "error",
    }),
  ],
});

export default logger;
