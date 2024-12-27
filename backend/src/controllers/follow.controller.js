import User from "../models/user.model.js";
import errorHandler from "../lib/error.js";
import Notification from "../models/notification.model.js";
import FollowRequest from "../models/followRequest.model.js";

export async function sendFollowRequest(req, res, next) {
  try {
    const senderId = req.user._id,
      receiverId = req.params.id;

    if (senderId.equals(receiverId))
      return next(errorHandler(400, "Can't send follow request to yourself"));

    if (!(await User.findById(receiverId)))
      return next(errorHandler(400, "Invalid receiver"));

    if (req.user.following.includes(receiverId))
      return next(errorHandler(400, "You are already following this receiver"));

    const existingRequest = await FollowRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest?.status === "pending")
      return next(errorHandler(400, "Request already pending"));

    if (existingRequest) await existingRequest.deleteOne();

    const notification = await Notification.create({
      sender: senderId,
      receiver: receiverId,
      type: "followRequestReceived",
    });

    const followRequest = await FollowRequest.create({
      sender: senderId,
      receiver: receiverId,
      notification: notification._id,
    });

    await User.findByIdAndUpdate(receiverId, {
      $push: { notifications: notification },
      $addToSet: { followerRequests: followRequest },
    });

    await User.findByIdAndUpdate(senderId, {
      $addToSet: { followingRequests: followRequest },
    });

    return res.status(200).json({ message: "Follow request sent" });
  } catch (error) {
    console.error(error.message);
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

    if (!followRequest || followRequest.status !== "pending")
      return next(errorHandler(404, "No such follow request exists"));

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

    await followRequest.deleteOne();

    return res.status(200).json({ message: "Follow request accepted" });
  } catch (error) {
    console.error(error.message);
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
      status: "pending",
    });

    if (!followRequest)
      return next(errorHandler(404, "Follow request doesn't exist"));

    await User.findByIdAndUpdate(receiverId, {
      $pull: { followerRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(senderId, {
      $pull: { followingRequests: followRequest._id },
    });

    await followRequest.deleteOne();

    res.status(200).json({ message: "Follow request rejected" });
  } catch (error) {
    console.error(error.message);
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

    if (!followRequest)
      return next(errorHandler(404, "Follow request not found"));

    await User.findByIdAndUpdate(senderId, {
      $pull: { followingRequests: followRequest._id },
    });

    await User.findByIdAndUpdate(receiverId, {
      $pull: { followerRequests: followRequest._id },
    });

    if (!followRequest.seen) {
      await User.findByIdAndUpdate(receiverId, {
        $pull: { notifications: followRequest.notification },
      });
      await Notification.findByIdAndDelete(followRequest.notification);
    }
    await followRequest.deleteOne();

    return res.status(200).json({ message: "Follow request cancelled" });
  } catch (error) {
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function removeFollower(req, res, next) {
  try {
    const user = await User.findById(req.user._id),
      followerToRemove = await User.findById(req.params.id);

    if (!followerToRemove)
      return next(errorHandler(404, "Follower doesn't exist"));

    if (!user.followers.some((flwr) => followerToRemove.equals(flwr)))
      return next(errorHandler(404, "You're not being followed by them"));

    await user.updateOne({
      $pull: { followers: followerToRemove._id },
    });

    await followerToRemove.updateOne({
      $pull: { following: user._id },
    });

    return res.status(200).json({ message: "Follower removed" });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unfollow(req, res, next) {
  try {
    const user = await User.findById(req.user._id),
      userToUnfollow = await User.findById(req.params.id);

    if (!user.following.some((user) => userToUnfollow.equals(user)))
      return next(errorHandler(404, "You're not following them"));

    await user.updateOne({
      $pull: { following: userToUnfollow._id },
    });

    await userToUnfollow.updateOne({
      $pull: { followers: user._id },
    });

    return res.status(200).json({ message: "Unfollowed" });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
