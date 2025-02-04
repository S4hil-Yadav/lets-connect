import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../lib/utils.js";
import errorHandler from "../lib/error.js";
import cloudinary from "../lib/cloudinary.js";

export async function signup(req, res, next) {
  try {
    const email = req.body.email.toLowerCase().replace(/\s+/g, ""),
      username = req.body.username.trim().replace(/\s+/g, ""),
      fullname = req.body.fullname.trim(),
      password = req.body.password.trim().replace(/\s+/g, "");

    if (!email || !username || !fullname || !password) return next(errorHandler(422, "All fields are required"));

    if (!/.+@.+\..+/.test(email)) return next(errorHandler(422, "Invalid email address"));
    if (username.length > 20) return next(errorHandler(422, "Maximum username length is 20"));
    if (password.length < 6) return next(errorHandler(422, "Minimun password length is 6"));
    if (password.length > 30) return next(errorHandler(422, "Maximum password length is 30"));

    if (fullname.split(" ").length > 5 || fullname.length > 30)
      return next(errorHandler(422, "Only 5 words and max length 30 is allowed"));

    if (await User.findOne({ email })) return next(errorHandler(409, "Email already exists"));
    if (await User.findOne({ username })) return next(errorHandler(409, "Username already exists"));

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      username,
      fullname,
      password: hashedPassword,
    }).catch(_err => next(errorHandler(422, "Invalid user data")));

    generateToken(newUser._id, res);

    return res.status(204).end();
  } catch (error) {
    console.error("Error in signup controler :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function login(req, res, next) {
  try {
    const email = req.body.email.trim().toLowerCase(),
      password = req.body.password.trim();

    if (!email || !password) return next(errorHandler(400, "All fields are required"));

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("password");

    if (!user) return next(errorHandler(400, "User not found (check email)"));
    if (!(await bcrypt.compare(password.trim(), user.password))) return next(errorHandler(400, "Password mismatch"));

    generateToken(user._id, res);

    return res.status(204).end();
  } catch (error) {
    console.error("Error in login controller :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export function logout(_req, res, next) {
  try {
    // if (!req.cookies.jwt) return next(errorHandler(401, "Already logged out"));
    res.clearCookie("jwt");
    return res.status(204).end();
  } catch (error) {
    console.error("Error in logout controller :", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function getAuthUser(req, res, next) {
  try {
    const authUser = await User.findById(req.user._id).select("username email fullname profilePic");

    return res.status(200).json(authUser);
  } catch (error) {
    console.error("Error in getAuthUser controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function updateUser(req, res, next) {
  try {
    const email = req.body.email.toLowerCase().replace(/\s+/g, ""),
      username = req.body.username.replace(/\s+/g, ""),
      fullname = req.body.fullname.trim(),
      newProfilePic = req.body.profilePic.replace(/\s+/g, "");

    if (!username || !fullname || !email.trim()) next(errorHandler(400, "All fields are required"));

    const { profilePic: prevProfilePic } = await User.findById(req.user._id).select("profilePic");

    const uploadRes = newProfilePic && newProfilePic !== prevProfilePic ? await cloudinary.uploader.upload(newProfilePic) : null;

    await User.findByIdAndUpdate(req.user._id, {
      username,
      fullname,
      email,
      profilePic: !newProfilePic ? "" : newProfilePic === prevProfilePic ? prevProfilePic : uploadRes.secure_url,
    });

    if (prevProfilePic && prevProfilePic !== newProfilePic) {
      const publicId = prevProfilePic.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(publicId);
    }

    return res.status(204).end();
  } catch (error) {
    console.error("Error in updateUser controller : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

export async function updateUserBio(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { bio: req.body.bio.trim() });
    return res.status(204).end();
  } catch (error) {
    console.error("Error in updateUserBio controller : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}

// export async function deleteUser(req, res, next) {
//   const user = await User.findById(req.user._id);
// }

// Development
export async function checkAuth(req, res, next) {
  try {
    return res.status(200).json(await User.findById(req.user._id).select("-password"));
  } catch (error) {
    console.error("Error in checkAuth controler : ", error.message);
    return next(errorHandler(500, "Internal Server Error"));
  }
}
