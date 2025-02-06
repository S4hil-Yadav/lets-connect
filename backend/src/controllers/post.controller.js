import errorHandler from "../lib/error.js";
import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import cloudinary from "../lib/cloudinary.js";
import Comment from "../models/comment.model.js";

export async function createPost(req, res, next) {
  try {
    const { title, body, images } = JSON.parse(req.body.post),
      video = req.file,
      publisher = await User.findById(req.user._id).select("followers").lean();

    if (!body.trim() && !images?.length && !video) return next(errorHandler(400, "Post can't be empty"));
    if (images?.length && video) return next(errorHandler(400, "Can't post both photos and video"));

    const imagesURL = [];

    for (const image of images) {
      const cloudinaryImgRes = await cloudinary.uploader.upload(image);
      imagesURL.push(cloudinaryImgRes.secure_url);
    }

    const cloudinaryVideoRes = video ? await cloudinary.uploader.upload(video.path, { resource_type: "video" }) : null;

    const post = await Post.create({
      publisher: publisher._id,
      title: title.trim(),
      body: body.trim(),
      images: imagesURL,
      video: cloudinaryVideoRes?.url || "",
    });

    await User.findByIdAndUpdate(publisher._id, { $push: { posts: post._id } });

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

export async function SearchPosts(req, res, next) {
  try {
    const { search } = req.query || "";
    const posts = await Post.find({
      $or: [{ title: { $regex: search, $options: "i" } }, { body: { $regex: search, $options: "i" } }],
    })
      .sort({ createdAt: -1 })
      .select("_id")
      .limit(10)
      .lean();

    return res.status(200).json(posts);
  } catch (error) {
    console.error("Error in searchPosts controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getAllPosts(_req, res, next) {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }).select("_id deleted").lean();
    return res.status(200).json(posts.flatMap(post => (post.deleted ? [] : [post._id])));
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getPost(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId)
      .populate({ path: "publisher", select: "username fullname profilePic" })
      .lean();
    if (!post) return next(errorHandler(404, "Post not found"));

    const { _id, deleted, createdAt, publisher } = post;
    return res.status(200).json(post.deleted ? { _id, deleted, createdAt, publisher } : post);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getSavedPosts(req, res, next) {
  try {
    const { savedPosts } = await User.findById(req.user._id)
      .populate({
        path: "savedPosts",
        select: "_id deleted",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
    return res.status(200).json(savedPosts.flatMap(post => (post.deleted ? [] : [post._id])));
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getLikedPosts(req, res, next) {
  try {
    const { likedPosts } = await User.findById(req.user._id)
      .populate({
        path: "likedPosts",
        select: "_id deleted",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
    return res.status(200).json(likedPosts.flatMap(post => (post.deleted ? [] : [post._id])));
  } catch (error) {
    console.error("Error in getFollowing controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getDislikedPosts(req, res, next) {
  try {
    const { dislikedPosts } = await User.findById(req.user._id)
      .populate({
        path: "dislikedPosts",
        select: "_id deleted",
        options: { sort: { createdAt: -1 } },
      })
      .lean();
    return res.status(200).json(dislikedPosts.flatMap(post => (post.deleted ? [] : [post._id])));
  } catch (error) {
    console.error("Error in getFollowing controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function likePost(req, res, next) {
  try {
    const likerId = req.user._id,
      post = await Post.findById(req.params.postId).populate({ path: "publisher", select: "_id" }).select("_id publisher").lean();

    if (!post) return res.status(404).json({ message: "Post not found" });

    await Post.findByIdAndUpdate(post._id, { $pull: { dislikers: likerId }, $addToSet: { likers: likerId } });
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

    if (postExists) await Post.findByIdAndUpdate(postId, { $pull: { likers: likerId } });
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

    if (postExists) await Post.findByIdAndUpdate(postId, { $pull: { dislikers: dislikerId } });
    await User.findByIdAndUpdate(dislikerId, { $pull: { dislikedPosts: postId } });

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function savePost(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { savedPosts: req.params.postId } });
    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function deletePost(req, res, next) {
  try {
    const { postId } = req.params,
      allowed = await Post.exists({ _id: postId, publisher: req.user._id });

    if (!allowed) next(errorHandler(401, "Can't delete other's posts"));

    await Post.findByIdAndUpdate(req.params.postId, { deleted: true });
    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function unsavePost(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { $pull: { savedPosts: req.params.postId } });
    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function submitComment(req, res, next) {
  try {
    const { postId } = req.params,
      commentorId = req.user._id,
      commentText = req.body.comment.trim();

    const post = await Post.findById(postId).select("publisher").lean();
    if (!post) return next(errorHandler(404, "Post not found"));

    if (!commentText) return next(errorHandler(422, "Comment can't be empty"));

    const newComment = await Comment.create({
      commentor: commentorId,
      text: commentText,
    });

    if (!commentorId.equals(post.publisher)) {
      const notification = await Notification.create({
        sender: commentorId,
        receiver: post.publisher,
        type: "comment",
        post: post._id,
        comment: newComment._id,
      });
      await User.findByIdAndUpdate(post.publisher, { $push: { notifications: notification._id } });
    }

    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });
    await User.findByIdAndUpdate(commentorId, { $push: { comments: newComment._id } });

    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function editComment(req, res, next) {
  try {
    const commentorId = req.user._id,
      { commentId } = req.params,
      editedComment = req.body.editedComment.trim();

    const allowed = await Comment.exists({ _id: commentId, commentor: commentorId });
    if (!allowed) return next(errorHandler(401, "Not allowed"));

    if (editedComment)
      await Comment.findByIdAndUpdate(commentId, {
        text: editedComment,
        edited: true,
      });

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function deleteComment(req, res, next) {
  try {
    const commentorId = req.user._id,
      { postId, commentId } = req.params;

    const allowed = await Comment.exists({ _id: commentId, commentor: commentorId });
    if (!allowed) return next(errorHandler(401, "Not allowed"));

    const postExists = await Post.exists({ _id: postId });
    if (postExists) await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });

    await User.findByIdAndUpdate(commentorId, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);

    return res.status(204).end();
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getComments(req, res, next) {
  try {
    const post = await Post.findById(req.params.postId)
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "commentor",
          select: "username fullname profilePic",
        },
      })
      .lean();

    if (!post) return next(errorHandler(404, "Post not found"));
    return res.status(200).json(post.comments);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
