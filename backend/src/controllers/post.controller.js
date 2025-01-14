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

    return res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    return next();
  }
}

export async function deletePost(req, res, next) {
  try {
    const publisherId = req.user._id,
      { postId } = req.params;

    if (!(await Post.exists({ _id: postId }))) return next(errorHandler(404, "Post not found"));

    await User.findByIdAndUpdate(publisherId, { $pull: { posts: postId } });
    await Post.findByIdAndDelete(postId);

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function SearchPosts(req, res, next) {
  try {
    const { search } = req.query || "";
    const posts = await Post.find({
      $or: [{ title: { $regex: search, $options: "i" } }, { body: { $regex: search, $options: "i" } }],
    })
      .select("_id")
      .limit(10);

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in searchPosts controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getAllPosts(_req, res, next) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select("_id");
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId).populate({ path: "publisher", select: "username fullname profilePic" });
    if (!post) return next(errorHandler(404, "Post not found"));

    return res.status(200).json(post);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function likePost(req, res, next) {
  try {
    const likerId = req.user._id,
      post = await Post.findById(req.params.postId).populate({ path: "publisher", select: "_id" }).select("_id publisher");

    if (!post) return res.status(404).json({ message: "Post not found" });

    await post.updateOne({ $pull: { dislikers: likerId }, $addToSet: { likers: likerId } });
    await User.findByIdAndUpdate(likerId, { $pull: { dislikedPosts: post._id }, $addToSet: { likedPosts: post._id } });

    if (!post.publisher._id.equals(likerId)) {
      const notification = await Notification.create({
        sender: likerId,
        receiver: post.publisher._id,
        type: "postLike",
        post: post._id,
      });
      await User.findByIdAndUpdate(post.publisher._id, { $addToSet: { notifications: notification._id } });
    }

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unlikePost(req, res, next) {
  try {
    const likerId = req.user._id,
      { postId } = req.params,
      postExists = await Post.exists({ _id: postId });

    if (!postExists) return next(errorHandler(404, "Post not found"));

    await Post.findByIdAndUpdate(postId, { $pull: { likers: likerId } });
    await User.findByIdAndUpdate(likerId, { $pull: { likedPosts: postId } });

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function dislikePost(req, res, next) {
  try {
    const dislikerId = req.user._id,
      { postId } = req.params,
      postExists = await Post.exists({ _id: postId });

    if (!postExists) return next(errorHandler(404, "Post not found"));
    await Post.findByIdAndUpdate(postId, { $pull: { likers: dislikerId }, $addToSet: { dislikers: dislikerId } });
    await User.findByIdAndUpdate(dislikerId, { $pull: { likedPosts: postId }, $addToSet: { dislikedPosts: postId } });

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function undislikePost(req, res, next) {
  try {
    const dislikerId = req.user._id,
      { postId } = req.params,
      postExists = await Post.exists({ _id: postId });

    if (!postExists) return res.status(404).json({ message: "Post not found" });

    await Post.findByIdAndUpdate(postId, { $pull: { dislikers: dislikerId } });

    return res.status(204).end();
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

    const newComment = await Comment.create({
      commentor: req.user._id,
      text: commentText.trim(),
    });

    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getComments(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "comments",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "commentor",
        select: "username fullname profilePic",
      },
    });

    if (!post) return next(errorHandler(404, "Post not found"));

    return res.status(200).json(post.comments);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getLikedPosts(req, res, next) {
  try {
    const user = await User.findById(req.params.userId).select("likedPosts");

    if (!user) return next(errorHandler(404, "User not found"));

    return res.status(200).json(user.likedPosts);
  } catch (error) {
    console.error("Error in getFollowing controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getDislikedPosts(req, res, next) {
  try {
    const { dislikedPosts } = await User.findById(req.user._id).select("dislikedPosts");

    return res.status(200).json(dislikedPosts);
  } catch (error) {
    console.error("Error in getFollowing controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
