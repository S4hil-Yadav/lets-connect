import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";

export async function getNotifications(req, res, next) {
  try {
    const { notifications } = await User.findById(req.user._id)
      .populate({
        path: "notifications",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "sender", select: "fullname username profilePic" },
          { path: "post", select: "title body images" },
          { path: "comment", select: "text" },
        ],
      })
      .select("notifications")
      .limit(25);

    return res.status(200).json(notifications);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany({ _id: { $in: req.body } }, { $set: { read: true } });
    return res.status(204).end;
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
