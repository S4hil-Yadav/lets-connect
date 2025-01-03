import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";

export async function getAuthUser(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate([
      { path: "followers", select: "username fullname profilePic" },
      { path: "following", select: "username fullname profilePic" },
    ]);
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getAuthUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .populate(["followers", "following"])
      .select("email username fullname profilePic bio posts followers following");

    if (!user) return next(errorHandler(404, "User not found"));

    return res.status(200).json({
      email: user.email,
      username: user.username,
      fullname: user.fullname,
      profilePic: user.profilePic,
      bio: user.bio,
      postCount: user.posts.length,
      followerCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (error) {
    console.error("Error in getUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getUsers(_req, res, next) {
  try {
    const users = await User.find().select("-password -notifications -followers -following -followerRequests -followingRequests");
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowers(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
      .populate([{ path: "followers", select: "username fullname profilePic" }])
      .select("followers");

    if (!user) return next(errorHandler(404, "User not found"));

    return res.status(200).json(user.followers);
  } catch (error) {
    console.error("Error in getAuthUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
