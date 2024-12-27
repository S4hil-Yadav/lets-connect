import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  getAuthUser,
  getUser,
  getUsers,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/get-auth-user", protectRoute, getAuthUser);
router.get("/get-user/:id", getUser);
router.get("/get-users", getUsers);

export default router;
