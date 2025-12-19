const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const sendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};
exports.signup = async (req, res) => {
  try {
    const { name, email, password, passwordConfirm, role } = req.body;
    if (!name || !email || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "fail",
        message: "All fields are required",
      });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    });
    sendToken(newUser, 201, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Email and password required",
      });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    const isCorrect = await user.correctPassword(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({
        status: "fail",
        message: "Invalid email or password",
      });
    }
    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
exports.updateMyDetails = async (req, res, next) => {
  try {
    const filteredBody = {};
    const allowedFields = ["name", "email", "image"];
    Object.keys(req.body).forEach((el) => {
      if (allowedFields.includes(el)) filteredBody[el] = req.body[el];
    });
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(new AppError("Failed to update details.", 500));
  }
};
exports.updateMyPassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("+password");
    if (
      !(await user.correctPassword(req.body.currentPassword, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.confirmPassword;
    await user.save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    user.password = undefined;
    res.status(200).json({
      status: "success",
      token,
      data: {
        user,
      },
    });
  } catch (err) {
    next(new AppError("Failed to update password.", 500));
  }
};
