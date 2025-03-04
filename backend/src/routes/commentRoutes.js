import express from "express";
import { createComment, getComments, updateComment, deleteComment, likeComment, unlikeComment } from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:postId", protect, getComments);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like", protect, likeComment);
router.post("/:id/unlike", protect, unlikeComment);

export default router;