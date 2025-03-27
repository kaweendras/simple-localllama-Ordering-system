import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const jwtSecret = process.env.SECRET_KEY as string;

const verifyToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, jwtSecret);
    return { valid: true, decoded };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
};

//create unique token with timestamp and hashing it
const createUniqueKey = () => {
  const timestamp = new Date().getTime();
  //hashing the timestamp using sha256
  const hash = crypto.createHash("sha256");
  const data = hash.update(timestamp.toString(), "utf-8");
  const gen_hash = data.digest("hex");
  const uniqueKey = gen_hash;
  return uniqueKey;
};

export { verifyToken, createUniqueKey };
