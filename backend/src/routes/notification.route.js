import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/get-notifications", protectRoute, getNotifications);

// router.put("/:id/read", protectRoute, markNotificationAsRead);
// router.delete("/:id", protectRoute, deleteNotification);

export default router;
