import errorHandler from "../lib/error.js";
import Comment from "../models/comment.model.js";

export async function getComments(req, res, next) {
  try {
    const { commentIds } = req.body;
    comments = await Comment.find({ _id: { $in: commentIds } }).populate({
      path: "commentor",
      select: "username fullname profilePic",
    });
    return res.status(200).json(comments);
  } catch (error) {
    console.error(error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
