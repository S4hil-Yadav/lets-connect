import User from "../models/user.model.js";
import errorHandler from "../lib/error.js";
import Notification from "../models/notification.model.js";
import FollowRequest from "../models/followRequest.model.js";

export async function sendFollowRequest(req, res, next) {
  try {
    const sender = await User.findById(req.user._id).select("following"),
      receiver = await User.findById(req.params.id);

    if (sender._id.equals(receiver._id)) return next(errorHandler(400, "Can't send follow request to yourself"));
    if (!receiver) return next(errorHandler(400, "Invalid receiver"));
    if (sender.following.includes(receiver._id)) return next(errorHandler(400, "You are already following this receiver"));

    const existingRequest = await FollowRequest.findOne({
      sender: sender._id,
      receiver: receiver._id,
    });

    if (existingRequest?.status === "pending") return next(errorHandler(400, "Request already pending"));

    if (existingRequest) await existingRequest.deleteOne();

    const notification = await Notification.create({
      sender: sender._id,
      receiver: receiver._id,
      type: "followRequestReceived",
    });

    const followRequest = await FollowRequest.create({
      sender: sender._id,
      receiver: receiver._id,
      notification: notification._id,
    });

    await receiver.updateOne({
      $push: { notifications: notification._id },
      $addToSet: { followerRequests: followRequest._id },
    });

    await sender.updateOne({
      $addToSet: { followingRequests: followRequest._id },
    });

    return res.status(200).json({ message: "Follow request sent" });
  } catch (error) {
    console.error("Error in sendFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function acceptFollowRequest(req, res, next) {
  try {
    const senderId = req.params.id,
      receiverId = req.user._id;

    const followRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });
    if (followRequest?.status !== "pending") return next(errorHandler(404, "No such follow request exists"));

    await followRequest.deleteOne();

    const notification = await Notification.create({
      sender: receiverId,
      receiver: senderId,
      type: "followRequestAccepted",
    });

    await User.findByIdAndUpdate(receiverId, {
      $addToSet: { followers: senderId },
      $pull: { followerRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { following: receiverId },
      $pull: { followingRequests: followRequest._id },
      $push: { notifications: notification._id },
    });

    return res.status(200).json({ message: "Follow request accepted" });
  } catch (error) {
    console.error("Error in acceptFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function rejectFollowRequest(req, res, next) {
  try {
    const senderId = req.params.id,
      receiverId = req.user._id;

    const followRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (followRequest?.status !== "pending") return next(errorHandler(404, "Follow request doesn't exist"));

    await User.findByIdAndUpdate(receiverId, {
      $pull: { followerRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(senderId, {
      $pull: { followingRequests: followRequest._id },
    });

    await followRequest.deleteOne();

    res.status(200).json({ message: "Follow request rejected" });
  } catch (error) {
    console.error("Error in rejectFollowRequest controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function cancelFollowRequest(req, res, next) {
  try {
    const senderId = req.user._id,
      receiverId = req.params.id;

    const followRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });

    if (!followRequest) return next(errorHandler(404, "Follow request not found"));

    await User.findByIdAndUpdate(senderId, {
      $pull: { followingRequests: followRequest._id },
    });

    if (followRequest.seen)
      await User.findByIdAndUpdate(receiverId, {
        $pull: { followerRequests: followRequest._id },
      });
    else {
      await User.findByIdAndUpdate(receiverId, {
        $pull: { followerRequests: followRequest._id, notifications: followRequest.notification._id },
      });
      await Notification.findByIdAndDelete(followRequest.notification._id);
    }
    await followRequest.deleteOne();

    return res.status(200).json({ message: "Follow request cancelled" });
  } catch (error) {
    console.error("Error in cancelFollowRequest controller", error.message);
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
    await User.findByIdAndUpdate(followerId, { $pull: { following: user._id } });

    return res.status(200).json({ message: "Follower removed" });
  } catch (error) {
    console.error("Error in removeFollower controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unfollow(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("following"),
      followingId = req.params.id;

    if (!user.following.some(followedUser => followedUser.equals(followingId)))
      return next(errorHandler(404, "You're not following this user"));

    await user.updateOne({ $pull: { following: followingId } });
    await User.findByIdAndUpdate(followingId, { $pull: { followers: user._id } });

    return res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    console.error("Error in follow controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getFollowRequests(req, res, next) {
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
        // {
        //   path: "followingRequests",
        //   select: "receiver",
        //   populate: {
        //     path: "receiver",
        //     select: "username fullname profilePic",
        //   },
        // },
      ])
      .select("followerRequests");

    return res.status(200).json(followerRequests);
  } catch (error) {
    console.error("Error in getFollowRequests controller", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
