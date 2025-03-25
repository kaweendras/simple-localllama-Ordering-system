import express from "express";
import { handleChat, handleUserResponse } from "../controllers/chatController";

const router = express.Router();

router.post("/chat", handleChat);

router.post("/user-response", handleUserResponse);

export default router;
