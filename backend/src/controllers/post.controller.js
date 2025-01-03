import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../lib/cloudinary.js";
import Comment from "../models/comment.model.js";

export async function createPost(req, res, next) {
  try {
    const { title, body, images } = req.body,
      publisher = await User.findById(req.user._id).select("followers");

    if (!body.trim() && !images?.length) return next(errorHandler(400, "Post can't be empty"));

    const imagesURL = [];

    for (const image of images) {
      const cloudinaryRes = await cloudinary.uploader.upload(image);
      imagesURL.push(cloudinaryRes.secure_url);
    }

    const post = await Post.create({
      publisher: publisher._id,
      title: title.trim(),
      body: body.trim(),
      images: imagesURL,
    });

    await publisher.updateOne({ $push: { posts: post._id } });

    publisher.followers.forEach(async followerId => {
      const notification = await Notification.create({
        sender: publisher._id,
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
    const publisherId = req.user._id,
      { id: postId } = req.params;

    if (!(await Post.exists({ _id: postId }))) return next(errorHandler(404, "Post not found"));

    await User.findByIdAndUpdate(publisherId, { $pull: { posts: postId } });
    await Post.findByIdAndDelete(postId);

    return res.status(204).json({ message: "Post deleted" });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getAllPosts(_req, res, next) {
  try {
    const posts = await Post.find()
      .populate([{ path: "publisher", select: "username fullname profilePic" }])
      .select("-likes -dislikes -comments")
      .sort({ createdAt: -1 });

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function likePost(req, res, next) {
  try {
    const likerId = req.user._id,
      post = await Post.findById(req.params.id)
        .populate({
          path: "publisher",
          select: "_id",
        })
        .select("likes dislikes");

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.dislikes?.some(disliker => disliker.equals(likerId))) return next(errorHandler(409, "Can't like a disliked post"));

    if (post.likes?.some(liker => liker.equals(likerId))) return next(errorHandler(409, "Post already liked"));

    const updatedPost = await Post.findByIdAndUpdate(
      post._id,
      {
        $addToSet: { likes: likerId },
      },
      { new: true }
    ).select("likes");

    if (!post.publisher._id.equals(likerId)) {
      const { _id: notificationId } = await Notification.create({
        sender: likerId,
        receiver: post.publisher._id,
        type: "postLike",
        post: post._id,
      });
      await User.findByIdAndUpdate(post.publisher._id, {
        $addToSet: { notifications: notificationId },
      });
    }
    return res.status(200).json({ likes: updatedPost.likes });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unlikePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).select("likes"),
      likerId = req.user._id;

    if (!post) return next(errorHandler(404, "Post not found"));

    if (!post.likes?.some(liker => liker.equals(likerId))) return next(errorHandler(409, "Post not liked"));

    const updatedPost = await Post.findByIdAndUpdate(post._id, { $pull: { likes: likerId } }, { new: true }).select("likes");

    return res.status(200).json({ likes: updatedPost.likes });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function dislikePost(req, res, next) {
  try {
    const dislikerId = req.user._id,
      post = await Post.findById(req.params.id).select("likes dislikes");

    if (!post) return next(errorHandler(404, "Post not found"));

    if (post.likes?.some(liker => liker.equals(dislikerId))) return next(errorHandler(409, "Can't dislike a liked post"));

    if (post.dislikes?.some(disliker => disliker.equals(dislikerId))) return next(errorHandler(409, "Post already disliked"));

    const updatedPost = await Post.findByIdAndUpdate(post._id, { $addToSet: { dislikes: dislikerId } }, { new: true }).select(
      "dislikes"
    );

    return res.status(200).json({ dislikes: updatedPost.dislikes });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function undislikePost(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).select("dislikes"),
      dislikerId = req.user._id;

    if (!post) return res.status(404).json({ message: "Post not found" });

    if (!post.dislikes?.some(disliker => disliker.equals(dislikerId)))
      return res.status(409).json({ message: "Post not disliked" });

    const updatedPost = await Post.findByIdAndUpdate(post._id, { $pull: { dislikes: dislikerId } }, { new: true }).select(
      "dislikes"
    );

    return res.status(200).json({ dislikes: updatedPost.dislikes });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getLikesDislikes(req, res, next) {
  try {
    const post = await Post.findById(req.params.id).select("likes dislikes");
    if (!post) return next(errorHandler(404, "Post not found"));
    return res.status(200).json({ likes: post.likes, dislikes: post.dislikes });
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function submitComment(req, res, next) {
  try {
    const { postId } = req.params,
      { comment: commentText } = req.body;

    if (!(await Post.exists({ _id: postId }))) return next(errorHandler(404, "Post not found"));

    if (!commentText.trim()) return next(errorHandler(422, "Comment can't be empty"));

    const comment = await Comment.create({
      commentor: req.user._id,
      text: commentText,
    });

    await Post.findByIdAndDelete(postId, { $push: { comments: comment._id } });
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getComments(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "comments",
      populate: {
        path: "commentor",
        select: "username fullname profilePic",
      },
    });

    if (!post) return next(errorHandler(404, "Post not found"));

    console.log(post.comments);
    return res.status(200).json(post.comments);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
