import mongoose from "mongoose";

const user = { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment = { type: mongoose.Schema.Types.ObjectId, ref: "Comment" };

const postSchema = new mongoose.Schema(
  {
    publisher: { ...user, required: true },
    title: { type: String, maxlength: 300 },
    body: String,
    images: [String],
    likers: [user],
    dislikers: [user],
    comments: [comment],
    shares: Number,
    updated: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// postSchema.pre("validate", (next) => {
//   if (!this.text && !this.img) next(new Error("Post can't be empty"));
//   else next();
// });

const Post = mongoose.model("Post", postSchema);
export default Post;
