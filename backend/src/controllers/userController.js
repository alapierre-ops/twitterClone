import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/authMiddleware.js";

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log("req.body :", req.body)
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: "User created", userId: user._id });
  } catch (error) {
    res.status(400).json({ message: "Error creating user", error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("req.body :", req.body)
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials. Please check your email and password." });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, userId: user._id });
};

export const verifyAuth = async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ isValid: false });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ isValid: false });
  }

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    return res.status(401).json({ isValid: false });
  }

  res.json({ isValid: true, userId: user._id, username: user.username });
};

export const getUserProfile = async (req, res) => {
  const { id } = req.params;
  console.log("getUserProfile id :", id)
  const user = await User.findById(id).select("-password");
  if (!user) return res.status(404).json({ message: "No account found." });
  res.json(user);
};