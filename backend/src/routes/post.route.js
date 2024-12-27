import express from "express";
import { createPost, deletePost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.put("/create-post", protectRoute, createPost);
router.delete("/delete-post/:id", protectRoute, deletePost);

export default router;
