import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "User already exists",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    await User.create({
      username,
      email,
      password: hashedPass,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(201).json({
        message: "invalid credentials",
        success: false,
      });
    }

    const isPasswordCorrect = bcrypt.compare(password, user.password);

    if(!isPasswordCorrect){
        return res.status(201).json({
            message: "invalid credentials",
            success: false,
          });
    }
  } catch (error) {
    console.log(error);
  }
};
