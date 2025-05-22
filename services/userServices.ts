import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createUser, getUserByEmail, UserDetails } from "../repos/userRepo";
import { createUniqueKey } from "../utils/authUtils";
import logger from "../utils/logger";

const SECRET_KEY = process.env.SECRET_KEY as string;

// User registration service
export const registerUser = async (userData: Omit<UserDetails, "userId">) => {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Generate userId and hash password
    const userId = createUniqueKey();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    // Create new user with hashed password
    const newUser = await createUser({
      ...userData,
      userId,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.userId }, SECRET_KEY, {
      expiresIn: "24h",
    });

    // Return user data without password and token
    return {
      user: {
        userId: newUser.userId,
        fname: newUser.fname,
        lname: newUser.lname,
        email: newUser.email,
      },
      token,
    };
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`❌ Error during user registration: ${error.message}`);
    } else {
      logger.error("❌ Unknown error during user registration");
    }
    throw error;
  }
};

// User login service
export const loginUser = async (email: string, password: string) => {
  try {
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      logger.error("❌ Invalid credentials");
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.error("❌ Invalid credentials");
      throw new Error("Invalid credentials");
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
      },
      SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    // Return user data without password and token
    logger.info("🔑 User logged in successfully");
    return {
      user: {
        userId: user.userId,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
      },
      token,
    };
  } catch (error) {
    logger.error(`❌ Error during user login: ${error}`);
    throw error;
  }
};
