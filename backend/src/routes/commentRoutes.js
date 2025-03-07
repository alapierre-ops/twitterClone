import express from "express";
import { createComment, getComments, updateComment, deleteComment, likeComment, unlikeComment, getCommentsCountByPost } from "../controllers/commentController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createComment);
router.get("/:post", protect, getComments);
router.put("/:id", protect, updateComment);
router.delete("/:id", protect, deleteComment);
router.post("/:id/like/:userId", protect, likeComment);
router.post("/:id/unlike/:userId", protect, unlikeComment);
router.get("/:postId/count", protect, getCommentsCountByPost);

export default router;