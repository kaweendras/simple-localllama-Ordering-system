import express from "express";
import { signup, login } from "../controllers/userController";

const router = express.Router();

// Authentication routes
router.post("/signup", signup);
router.post("/login", login);

export default router;
