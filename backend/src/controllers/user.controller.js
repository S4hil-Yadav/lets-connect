import mongoose from "mongoose";
import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";

export async function getUser(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(errorHandler(404, "Invalid user id"));

    const user = await User.findById(req.params.id)
      .select("email username fullname profilePic bio")
      .populate({
        path: "posts",
        select: "_id deleted",
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    user.posts = user.posts.flatMap(post => (post.deleted ? [] : [post._id]));
    if (!user) return next(errorHandler(404, "User not found"));
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function SearchUsers(req, res, next) {
  try {
    const { search } = req.query || "";
    const users = await User.find({
      $or: [{ username: { $regex: search, $options: "i" } }, { fullname: { $regex: search, $options: "i" } }],
    })
      .select("username fullname profilePic")
      .limit(25);

    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in searchUsers controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowers(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(errorHandler(404, "Invalid user id"));

  try {
    const user = await User.findById(req.params.id)
      .populate({ path: "followers", select: "username fullname profilePic" })
      .select("followers");

    if (!user) return next(errorHandler(404, "User not found"));

    return res.status(200).json(user.followers);
  } catch (error) {
    console.error("Error in getFollowers controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowings(req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return next(errorHandler(404, "Invalid user id"));

    const user = await User.findById(req.params.id)
      .populate({ path: "followings", select: "username fullname profilePic" })
      .select("followings");

    if (!user) return next(errorHandler(404, "User not found"));

    return res.status(200).json(user.followings);
  } catch (error) {
    console.error("Error in getFollowing controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
