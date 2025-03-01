import express from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost, addLike, removeLike } from "../controllers/postController.js";

const router = express.Router();

router.post("/", createPost);
router.post("/:postId/like/:userId", addLike);
router.post("/:postId/unlike/:userId", removeLike);
router.get("/", getPosts);
router.get("/:id", getPostById);
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;