import User from "../models/User";

import { createUniqueKey } from "../utils/authUtils";

export interface UserDetails {
  userId: string;
  fname: string;
  lname: string;
  email: string;
  password: string;
}

const getAllUsers = async () => {
  try {
    return await User.find({}, { password: 0 });
  } catch (error) {
    console.error("Error getting users:", error);
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
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
