import { Request, Response } from "express";
import { registerUser, loginUser } from "../services/userServices";

// User signup controller
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fname, lname, email, password } = req.body;

    // Validate input
    if (!fname || !lname || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    // Register new user
    const result = await registerUser({ fname, lname, email, password });

    // Return success response
    res.status(201).json({
      message: "User registered successfully",
      ...result,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// User login controller
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Login user
    const result = await loginUser(email, password);

    // Return success response
    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
};
