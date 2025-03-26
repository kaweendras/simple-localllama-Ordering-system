import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET as string;

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
  //hashing the timestamp
  const uniqueKey = jwt.sign({ timestamp }, jwtSecret);
  return uniqueKey;
};

export { verifyToken, createUniqueKey };
