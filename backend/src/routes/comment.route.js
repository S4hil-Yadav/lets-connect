import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getComments } from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/get-comments", getComments);

export default router;
