import express from "express";
import { handleChat, handleUserResponse } from "../controllers/chatController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/chat", authMiddleware, handleChat);

router.post("/user-response", handleUserResponse);

export default router;
