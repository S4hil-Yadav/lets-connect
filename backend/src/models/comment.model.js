import mongoose from "mongoose";
// import User from "./user.model";

const commentSchema = mongoose.Schema(
  {
    commentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: String,
    // img: String,
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
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
