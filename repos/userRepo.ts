import User from "../models/User";

import { createUniqueKey } from "../utils/authUtils";
import logger from "../utils/logger";

interface UserDetails {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
}

const getAllUsers = async () => {
  try {
    return await User.find({}, { password: 0 });
  } catch (error: any) {
    logger.error(`❌ Error fetching users from db: ${error.message}`);
    throw error;
  }
};

const createUser = async (userDetails: UserDetails) => {
  try {
    const newUser = new User({
      userId: userDetails.userId,
      fname: userDetails.fname,
      lname: userDetails.lname,
      email: userDetails.email,
      password: userDetails.password,
    });
    return await newUser.save();
  } catch (error: any) {
    logger.error(`❌ Error saving user in db from repo: ${error.message}`);
    throw error;
  }
};

const getUserByEmail = async (email: string) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    logger.error(`❌ Error fetching user by email from db: ${error}`);
    throw error;
  }
};

export { getAllUsers, createUser, UserDetails, getUserByEmail };
