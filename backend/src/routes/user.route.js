import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getFollowers, getFollowings, getUser, SearchUsers } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get-user/:id", getUser);
router.get("/search-users", SearchUsers);
router.get("/get-followers/:id", getFollowers);
router.get("/get-followings/:id", getFollowings);

export default router;
