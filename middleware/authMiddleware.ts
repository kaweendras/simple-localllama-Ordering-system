import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/authUtils";
import { JwtPayload } from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.error("No token provided User must logged in to do this action");
    return res.status(401).json({
      message: "No token provided User must logged in to do this action",
    });
  }

  const { valid, decoded, error } = verifyToken(token);
  if (!valid) {
    return res.status(401).json({ message: "Invalid token", error });
  }

  // Attach decoded token to request object
  // TODO : Fix this type issue and set decoded token to req.user
  // req.user = decoded;
  const email = (decoded as JwtPayload)?.email;
  if (decoded) {
    // logger.info(`Token verified for user: ${email}`);
  } else {
    console.error(`Token verification failed: ${email}`);
  }

  next();
};
