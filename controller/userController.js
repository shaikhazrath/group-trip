import { User } from "../models/userModel.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";

//type : Post
//route : /register
export const Regitser = async (req, res) => {
  try {
    if (req.files.avatar == null || req.files.avatar == undefined) {
      return res.status(400).json({ success: false, message: "add avatar" });
    } else {
      const avatar = req.files.avatar.tempFilePath;
      const avatarCloudinary = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatarphoto",
      });
      fs.rmSync(avatar, { recursive: true });

      const { name, email, password } = req.body;

      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({
            success: false,
            message: "User already exists with this email",
          });
      }

      user = await User.create({
        avatar: {
          public_id: avatarCloudinary.public_id,
          url: avatarCloudinary.url,
        },
        name,
        email,
        password,
      });
      sendToken(res, user, 200, "User Register");
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//type : Post
//route : /login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }
    sendToken(res, user, 200, "User login");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//type : Get
//route : /logout
export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//type :Get
//route :loaduser
//auth  :required
export const loadUser = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// //type :Get
// //route :getallusers
// //aurh :required
// export const getAllUsers = async (req, res) => {
//   try {
//     const keyword = req.query.search
//       ? {
//           $or: [{ name: { $regex: req.query.search, $options: "i" } }],
//         }
//       : {};

//     const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });

//     res.status(200).json({
//       success: true,
//       users,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
