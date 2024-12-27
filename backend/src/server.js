import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import followRoute from "./routes/follow.route.js";
// import notificationRoute from "./routes/notification.route.js";
import { connectDB } from "./lib/db.js";

const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/posts", postRoute);
// app.use("/api/v1/notifictions", notificationRoute);
app.use("/api/v1/follow", followRoute);

app.listen(2000, () => {
  console.log("Server is running on port", process.env.PORT);
  connectDB();
});

app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";
  return res.status(statusCode).json({ success: false, statusCode, message });
});
