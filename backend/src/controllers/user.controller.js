import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";

export async function getAuthUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate([
      "followers",
      "following",
      { path: "followers", select: "username fullname profilePic" },
      { path: "following", select: "username fullname profilePic" },
      {
        path: "followerRequests",
        options: { sort: { createdAt: -1 } },
        select: "sender",
        populate: {
          path: "sender",
          select: "username fullname profilePic",
        },
      },
      {
        path: "followingRequests",
        select: "receiver",
        populate: {
          path: "receiver",
          select: "username fullname profilePic",
        },
      },
      {
        path: "notifications",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "sender", select: "fullname username profilePic" },
          { path: "post", select: "title img" },
          { path: "comment", select: "text" },
        ],
      },
    ]);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAuthUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .select("-password -notifications -followerRequests -followingRequests")
      .populate(["followers", "following"]);

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
export async function getUsers(_req, res, next) {
  try {
    const users = await User.find().select(
      "-password -notifications -followers -following -followerRequests -followingRequests"
    );
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
