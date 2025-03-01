import express from "express";
import { createComment, getComments, updateComment, deleteComment, likeComment, unlikeComment } from "../controllers/commentController.js";

const router = express.Router();

router.post("/", createComment);
router.get("/:postId", getComments);
router.put("/:id", updateComment);
router.delete("/:id", deleteComment);
router.post("/:id/like", likeComment);
router.post("/:id/unlike", unlikeComment);

export default router;