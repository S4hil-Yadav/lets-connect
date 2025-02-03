import mongoose from "mongoose";
// import validator from "validator";

const user = { type: mongoose.Schema.Types.ObjectId, ref: "User" };
const comment = { type: mongoose.Schema.Types.ObjectId, ref: "Comment" };
const post = { type: mongoose.Schema.Types.ObjectId, ref: "Post" };
const notif = { type: mongoose.Schema.Types.ObjectId, ref: "Notification" };
const fReq = { type: mongoose.Schema.Types.ObjectId, ref: "FollowRequest" };

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+@.+\..+/, "Invalid email address"],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      maxlength: [20, "Username can't exceed 20 characters"],
    },
    fullname: {
      type: String,
      required: true,
      validate: {
        validator: value => value.split(" ").length <= 5 && value.length <= 30,
        message: "Only 5 words and max length 30 is allowed",
      },
    },
    profilePic: { type: String, default: "" },
    password: { type: String, required: true },
    bio: { type: String, default: "", maxlength: [255, "Bio can not exceed 255 characters"] },
    followerRequests: [fReq],
    followingRequests: [fReq],
    followers: [user],
    followings: [user],
    notifications: [notif],
    posts: [post],
    likedPosts: [post],
    dislikedPosts: [post],
    savedPosts: [post],
    comments: [comment],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
