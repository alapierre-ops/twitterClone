import express from "express";
import { 
  createPost, getPosts, getPostById, updatePost, 
  deletePost, addLike, removeLike, getPostsByUserId, 
  getPostsByFollowing, getLikedPostsByUserId, getRepliesByUserId 
} from "../controllers/postController.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", protect, createPost);
router.post("/:postId/like/:userId", protect, addLike);
router.post("/:postId/unlike/:userId", protect, removeLike);
router.get("/", protect, getPosts);
router.get("/:id", protect, getPostById);
router.get("/user/:userId", protect, getPostsByUserId);
router.get("/user/:userId/likes", protect, getLikedPostsByUserId);
router.get("/user/:userId/replies", protect, getRepliesByUserId);
router.get("/following/:userId", protect, getPostsByFollowing);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;