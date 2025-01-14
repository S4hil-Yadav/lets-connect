import express from "express";
import {
  createPost,
  deletePost,
  dislikePost,
  getAllPosts,
  getComments,
  getDislikedPosts,
  getLikedPosts,
  getPost,
  likePost,
  SearchPosts,
  submitComment,
  undislikePost,
  unlikePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/create-post", protectRoute, createPost);
router.delete("/:postId/delete-post", protectRoute, deletePost);
router.get("/search-posts", SearchPosts);
router.get("/get-all-posts", getAllPosts);
router.get("/:postId/get-post", getPost);
router.patch("/:postId/like-post", protectRoute, likePost);
router.delete("/:postId/unlike-post", protectRoute, unlikePost);
router.patch("/:postId/dislike-post", protectRoute, dislikePost);
router.delete("/:postId/undislike-post", protectRoute, undislikePost);
router.post("/:postId/submit-comment", protectRoute, submitComment);
router.get("/:postId/get-comments", getComments);
router.get("/get-liked-posts/:userId", getLikedPosts);
router.get("/get-disliked-posts", protectRoute, getDislikedPosts);

export default router;
