import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications, markAllAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/get-notifications", protectRoute, getNotifications);
router.put("/read-all", protectRoute, markAllAsRead);

export default router;
