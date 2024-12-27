import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import errorHandler from "../lib/error.js";
import cloudinary from "../lib/cloudinary.js";

export async function signup(req, res, next) {
  try {
    const { email, username, fullname, password } = req.body;
    if (!email || !username || !fullname || !password)
      return next(errorHandler(422, "All fields are required"));

    if (!/.+@.+\..+/.test(email))
      return next(errorHandler(422, "Invalid email address"));

    if (username.length > 20)
      return next(errorHandler(422, "Maximum username length is 20"));

    if (password.length < 6)
      return next(errorHandler(422, "Minimun password length is 6"));

    if (password.length > 30)
      return next(errorHandler(422, "Maximum password length is 30"));

    if (await User.findOne({ email }))
      return next(errorHandler(409, "Email already exists"));

    if (await User.findOne({ username }))
      return next(errorHandler(409, "Username already exists"));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password.trim(), salt);

    const newUser = await User.create({
      email: email.toLowerCase(),
      username,
      fullname,
      password: hashedPassword,
    }).catch((_err) => next(errorHandler(422, "Invalid user data")));

    generateToken(newUser._id, res);

    delete newUser._doc.password;
    return res.status(201).json(newUser._doc);
  } catch (error) {
    console.error("Error in signup controler :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return next(errorHandler(400, "All fields are required"));

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).populate([
      "followers",
      "following",
      { path: "followers", select: "username fullname profilePic" },
      { path: "following", select: "username fullname profilePic" },
      {
        path: "followerRequests",
        options: { sort: { createdAt: -1 } },
        select: "sender",
        populate: {
          path: "sender",
          select: "username fullname profilePic",
        },
      },
      {
        path: "followingRequests",
        select: "receiver",
        populate: {
          path: "receiver",
          select: "username fullname profilePic",
        },
      },
      {
        path: "notifications",
        options: { sort: { createdAt: -1 } },
        populate: [
          { path: "sender", select: "fullname username profilePic" },
          { path: "post", select: "title img" },
          { path: "comment", select: "text" },
        ],
      },
    ]);

    if (!user) return next(errorHandler(400, "User not found (check email)"));
    if (!(await bcrypt.compare(password.trim(), user.password)))
      return next(errorHandler(400, "Password mismatch"));

    generateToken(user._id, res);

    delete user._doc.password;
    return res.status(200).json(user._doc);
  } catch (error) {
    console.error("Error in login controller :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export function logout(req, res, next) {
  try {
    if (!req.cookies.jwt) return next(errorHandler(401, "Already logged out"));
    res.clearCookie("jwt");
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function updateUser(req, res, next) {
  try {
    const { profilePic } = req.body;

    if (!profilePic) next(errorHandler(400, "Profile pic is required"));

    const uploadRes = await cloudinary.uploader.upload(profilePic);

    await User.findByIdAndUpdate(req.user._id, {
      profilePic: uploadRes.secure_url,
    });

    if (!updateUser) return next(errorHandler(400, "Invalid profile picture"));

    return res.status(200).json({ message: "Profile picture updated" });
  } catch (error) {
    console.error("Error in updateUser controller : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function checkAuth(req, res, next) {
  try {
    return res.status(204).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

// export async function deleteUser(req, res, next) {
//   const user = await User.findById(req.user._id);

// }
