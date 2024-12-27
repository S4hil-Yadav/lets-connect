import express from "express";
import {
  sendFollowRequest,
  acceptFollowRequest,
  removeFollower,
  rejectFollowRequest,
  cancelFollowRequest,
  unfollow,
} from "../controllers/follow.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-follow-request/:id", protectRoute, sendFollowRequest);
router.post("/accept-follow-request/:id", protectRoute, acceptFollowRequest);
router.delete("/reject-follow-request/:id", protectRoute, rejectFollowRequest);
router.delete("/cancel-follow-request/:id", protectRoute, cancelFollowRequest);
router.delete("/remove-follower/:id", protectRoute, removeFollower);
router.delete("/unfollow/:id", protectRoute, unfollow);

export default router;
