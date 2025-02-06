import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import followRoute from "./routes/follow.route.js";
import commentRoute from "./routes/comment.route.js";
import notificationRoute from "./routes/notification.route.js";
import { connectDB } from "./lib/db.js";
import errorHandler from "./lib/error.js";

const app = express();
const PORT = process.env.PORT || 2000;
const __dirname = path.resolve();

dotenv.config();
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, parameterLimit: 100000, limit: "25mb" }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/follow", followRoute);
app.use("/api/v1/comments", commentRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (_req, res) => res.sendFile(path.resolve(__dirname, "../frontend", "dist", "index.html")));
}

app.listen(PORT, () => {
  console.log("Server is running on port", PORT);
  connectDB();
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
