import express from "express";
import { registerUser, loginUser, getUserProfile, verifyAuth, followUser, getFollowingUsers, getFollowers, updateUser } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", protect, verifyAuth);
router.get("/:id", protect, getUserProfile);
router.post("/:id/follow/:userId", protect, followUser);
router.get("/:id/following", protect, getFollowingUsers);
router.get("/:id/followers", protect, getFollowers);
router.put("/:id", protect, updateUser);

export default router;