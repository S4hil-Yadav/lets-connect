import mongoose from "mongoose";

const followRequestSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const FollowRequest = mongoose.model("FollowRequest", followRequestSchema);

export default FollowRequest;
