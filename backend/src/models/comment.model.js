import mongoose from "mongoose";
// import User from "./user.model";

const commentSchema = new mongoose.Schema(
  {
    commentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    // img: String,
    // replies: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //   },
    // ],
  },
  { timestamps: true }
);

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
