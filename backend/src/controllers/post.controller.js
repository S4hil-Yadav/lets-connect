import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../lib/cloudinary.js";

export async function createPost(req, res, next) {
  try {
    const user = await User.findById(req.user._id);

    const { title, text, img } = req.body;

    if (!text && !img) return next(errorHandler(400, "Post can't be empty"));

    const cloudinaryRes = img ? await cloudinary.uploader.upload(img) : null;

    const post = await Post.create({
      publisher: user._id,
      title,
      text,
      img: cloudinaryRes?.secure_url,
    });

    await user.updateOne({ $push: { posts: post._id } });

    user.followers.forEach(async (followerId) => {
      const notification = await Notification.create({
        sender: user._id,
        receiver: followerId,
        type: "post",
        post: post._id,
      });
      await User.findByIdAndUpdate(followerId, {
        $push: { notifications: notification._id },
      });
    });

    return res.status(200).json({ message: "post created", post });
  } catch (error) {
    console.error(error.message);
    return next();
  }
}

export async function deletePost(req, res, next) {
  try {
    const user = await User.findById(req.user._id),
      post = await Post.findById(req.params.id);

    if (!post) return next(errorHandler(404, "Post not found"));

    await user.updateOne({ $pull: { posts: post._id } });
    await post.deleteOne();

    return res.status(204).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error.message);
    return next();
  }
}
