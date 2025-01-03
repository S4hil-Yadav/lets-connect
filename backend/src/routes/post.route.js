import express from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getComments,
  getLikesDislikes,
  likePost,
  submitComment,
  undislikePost,
  unlikePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/create-post", protectRoute, createPost);
router.delete("/delete-post/:id", protectRoute, deletePost);
router.get("/get-all-posts", getAllPosts);
router.patch("/like-post/:id", protectRoute, likePost);
router.delete("/unlike-post/:id", protectRoute, unlikePost);
router.patch("/dislike-post/:id", protectRoute, dislikePost);
router.delete("/undislike-post/:id", protectRoute, undislikePost);
router.get("/get-likes-dislikes/:id", getLikesDislikes);
router.post("/:postId/submit-comment", protectRoute, submitComment);
router.get("/:postId/get-comments", protectRoute, getComments);

export default router;
