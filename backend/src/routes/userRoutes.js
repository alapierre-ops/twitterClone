import express from "express";
import { registerUser, loginUser, getUserProfile, verifyAuth } from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify", protect, verifyAuth);
router.get("/:id", protect, getUserProfile);

export default router;