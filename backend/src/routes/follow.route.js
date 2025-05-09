import express from "express";
import {
  sendFollowRequest,
  acceptFollowRequest,
  removeFollower,
  rejectFollowRequest,
  cancelFollowRequest,
  unfollow,
  getFollowerRequests,
  getFollowingRequests,
  readAllFollowRequests,
} from "../controllers/follow.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/send-follow-request/:id", protectRoute, sendFollowRequest);
router.post("/accept-follow-request/:id", protectRoute, acceptFollowRequest);
router.delete("/reject-follow-request/:id", protectRoute, rejectFollowRequest);
router.delete("/cancel-follow-request/:id", protectRoute, cancelFollowRequest);
router.put("/read-all-follow-requests", protectRoute, readAllFollowRequests);
router.delete("/remove-follower/:id", protectRoute, removeFollower);
router.delete("/unfollow/:id", protectRoute, unfollow);
router.get("/get-follower-requests", protectRoute, getFollowerRequests);
router.get("/get-following-requests", protectRoute, getFollowingRequests);

export default router;
