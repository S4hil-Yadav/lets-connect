import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";

export async function getNotifications(req, res, next) {
  try {
    const { notifications, followerRequests } = await User.findById(req.user._id)
      .populate({
        path: "notifications",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "sender", select: "fullname username profilePic" },
          { path: "post", select: "title body images" },
          { path: "comment", select: "text" },
        ],
      })
      .select("notifications followerRequests");

    return res.status(200).json({ notifications, followerRequestCount: followerRequests.length });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}