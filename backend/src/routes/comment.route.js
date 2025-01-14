import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCommentsByIds } from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/get-comments-by-ids", getCommentsByIds);

export default router;
