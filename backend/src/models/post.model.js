import mongoose from "mongoose";

const user = { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comment = { type: mongoose.Schema.Types.ObjectId, ref: "Comment" };

const postSchema = mongoose.Schema(
  {
    publisher: { ...user, required: true },
    title: String,
    text: String,
    img: String,
    likes: [user],
    comments: [comment],
    shares: Number,
    updated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// postSchema.pre("validate", (next) => {
//   if (!this.text && !this.img) next(new Error("Post can't be empty"));
//   else next();
// });

const Post = mongoose.model("Post", postSchema);
export default Post;
