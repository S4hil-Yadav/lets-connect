import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export async function protectRoute(req, res, next) {
  try {
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized - no token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return res.status(401).json({ message: "Unauthorized - invalid token" });

    const user = await User.findById(decoded.userId).select("_id");

    if (!user) return res.status(404).json({ message: "No auth user" });

    req.user = user._doc;

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware : ", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
}
