import express from "express";
import { createRepost, getReposts, deleteRepost, getRepostsCountByPost, getRepostsByUser } from "../controllers/repostController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createRepost);
router.get("/", protect, getReposts);
router.delete("/:postId/:authorId", protect, deleteRepost);
router.get("/:postId/count", protect, getRepostsCountByPost);
router.get("/:userId", protect, getRepostsByUser);

export default router;