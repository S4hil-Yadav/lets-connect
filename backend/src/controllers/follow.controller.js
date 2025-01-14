import User from "../models/user.model.js";
import errorHandler from "../lib/error.js";
import Notification from "../models/notification.model.js";
import FollowRequest from "../models/followRequest.model.js";

export async function sendFollowRequest(req, res, next) {
  try {
    const sender = await User.findById(req.user._id).select("followings"),
      receiver = await User.findById(req.params.id).select("_id");

    if (sender._id.equals(receiver._id)) return next(errorHandler(400, "Can't send follow request to yourself"));
    if (!receiver) return next(errorHandler(400, "Invalid receiver"));
    if (sender.followings.includes(receiver._id)) return next(errorHandler(400, "You are already following this receiver"));

    const existingRequest = await FollowRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
      status: "pending",
    });

    if (existingRequest) return next(errorHandler(400, "Request already pending"));

    if (existingRequest) await existingRequest.deleteOne();

    const followRequest = await FollowRequest.create({ sender: sender._id, receiver: receiver._id });

    await receiver.updateOne({ $addToSet: { followerRequests: followRequest._id } });
    await sender.updateOne({ $addToSet: { followingRequests: followRequest._id } });

    return res.status(200).json({ reqId: followRequest._id });
  } catch (error) {
    console.error("Error in sendFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function cancelFollowRequest(req, res, next) {
  try {
    const followRequest = await FollowRequest.findById(req.params.id);
    if (!followRequest || followRequest.status !== "pending") return next(errorHandler(404, "Follow request not found"));

    if (!req.user._id.equals(followRequest.sender)) return next(errorHandler(401, "Unauthorized"));

    await followRequest.deleteOne();

    await User.findByIdAndUpdate(followRequest.sender, {
      $pull: { followingRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(followRequest.receiver, {
      $pull: { followerRequests: followRequest._id },
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Error in cancelFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function acceptFollowRequest(req, res, next) {
  try {
    const followRequest = await FollowRequest.findById(req.params.id).select("sender receiver status");
    if (!followRequest || followRequest.status !== "pending") return next(errorHandler(404, "No such follow request exists"));

    if (!req.user._id.equals(followRequest.receiver)) return next(errorHandler(401, "Unauthorized"));

    const notification = await Notification.create({
      sender: followRequest.receiver,
      receiver: followRequest.sender,
      type: "followRequestAccepted",
    });

    await User.findByIdAndUpdate(followRequest.receiver, {
      $addToSet: { followers: followRequest.sender },
      $pull: { followerRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(followRequest.sender, {
      $addToSet: { followings: followRequest.receiver },
      $pull: { followingRequests: followRequest._id },
      $push: { notifications: notification._id },
    });

    await followRequest.deleteOne();

    return res.status(204).end();
  } catch (error) {
    console.error("Error in acceptFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function rejectFollowRequest(req, res, next) {
  try {
    const followRequest = await FollowRequest.findById(req.params.id).select("sender receiver status");
    if (!req.user._id.equals(followRequest.receiver)) return next(errorHandler(401, "Unauthorized"));

    if (followRequest?.status !== "pending") return next(errorHandler(404, "Follow request doesn't exist"));

    await User.findByIdAndUpdate(followRequest.receiver, {
      $pull: { followerRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(followRequest.sender, {
      $pull: { followingRequests: followRequest._id },
    });

    await followRequest.deleteOne();

    res.status(204).end();
  } catch (error) {
    console.error("Error in rejectFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function removeFollower(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("followers"),
      followerId = req.params.id;

    if (!user.followers.some(follower => follower.equals(followerId)))
      return next(errorHandler(404, "You're not being followed by them"));

    await user.updateOne({ $pull: { followers: followerId } });
    await User.findByIdAndUpdate(followerId, { $pull: { followings: user._id } });

    return res.status(204).end();
  } catch (error) {
    console.error("Error in removeFollower controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unfollow(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("followings"),
      followingId = req.params.id;

    if (!user.followings.some(following => following.equals(followingId)))
      return next(errorHandler(404, "You're not following this user"));

    await user.updateOne({ $pull: { followings: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { followers: user._id } });

    return res.status(204).end();
  } catch (error) {
    console.error("Error in follow controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowerRequests(req, res, next) {
  try {
    const { followerRequests } = await User.findById(req.user._id)
      .populate([
        {
          path: "followerRequests",
          options: { sort: { createdAt: -1 } },
          select: "sender",
          populate: {
            path: "sender",
            select: "username fullname profilePic",
          },
        },
      ])
      .select("followerRequests");

    return res.status(200).json(followerRequests);
  } catch (error) {
    console.error("Error in getFollowRequests controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowingRequests(req, res, next) {
  try {
    const { followingRequests } = await User.findById(req.user._id)
      .populate({
        path: "followingRequests",
        options: { sort: { createdAt: -1 } },
        select: "receiver",
        populate: {
          path: "receiver",
          select: "username fullname profilePic",
        },
      })
      .select("followingRequests");

    return res.status(200).json(followingRequests);
  } catch (error) {
    console.error("Error in getFollowRequests controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
