import express from "express";
import {
  createPost,
  deleteComment,
  deletePost,
  dislikePost,
  editComment,
  getAllPosts,
  getComments,
  getDislikedPosts,
  getLikedPosts,
  getPost,
  getSavedPosts,
  likePost,
  savePost,
  SearchPosts,
  submitComment,
  undislikePost,
  unlikePost,
  unsavePost,
} from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/create-post", protectRoute, createPost);
router.get("/search-posts", SearchPosts);
router.get("/get-all-posts", getAllPosts);
router.get("/:postId/get-post", getPost);
router.get("/get-saved-posts", protectRoute, getSavedPosts);
router.patch("/:postId/like-post", protectRoute, likePost);
router.delete("/:postId/unlike-post", protectRoute, unlikePost);
router.patch("/:postId/dislike-post", protectRoute, dislikePost);
router.delete("/:postId/undislike-post", protectRoute, undislikePost);
router.post("/:postId/save-post", protectRoute, savePost);
router.delete("/:postId/unsave-post", protectRoute, unsavePost);
router.delete("/:postId/delete-post", protectRoute, deletePost);
router.post("/:postId/submit-comment", protectRoute, submitComment);
router.patch("/edit-comment/:commentId", protectRoute, editComment);
router.delete("/:postId/delete-comment/:commentId", protectRoute, deleteComment);
router.get("/:postId/get-comments", getComments);
router.get("/get-liked-posts", protectRoute, getLikedPosts);
router.get("/get-disliked-posts", protectRoute, getDislikedPosts);

export default router;
