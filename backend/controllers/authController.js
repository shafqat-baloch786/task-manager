const User = require("../models/User.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const generateToken = require("../utils/generateToken.js");
const sendEmails = require("../utils/sendEmail.js");
const crypto = require("crypto");

// User registration
const register = async (request, response) => {
  const { name, email, password } = request.body;

  try {
    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return response.status(400).json({
        message: "User already exists!",
      });
    }

    const user = await User.create({ name, email, password });

    return response.status(201).json({
      token: generateToken(user._id),
      message: "User created successfully!",
    });
  } catch (error) {
    console.log("Error while registering user!", error);
    response.status(500).json({ message: "Server error" });
  }
};

// User login
const login = async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "Invalid email",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return response.status(400).json({
        message: "Invalid password",
      });
    }

    return response.status(200).json({
      token: generateToken(user._id),
      message: "User logged in...",
    });
  } catch (error) {
    console.log("Error while logging in...", error);
    return response.status(500).json({
      message: "Something went wrong!",
    });
  }
};

// Edit / Update user
const editUser = async (request, response) => {
  const { name, email } = request.body;

  try {
    const user = await User.findById(request.user.id);

    if (!user) {
      return response.status(404).json({
        message: "User not found!",
      });
    }

    if (email !== user.email) {
      const emailExists = await User.findOne({ email });

      if (emailExists) {
        return response.status(400).json({
          message: "This email is already taken by a user!",
        });
      }
    }

    user.name = name;
    user.email = email;

    await user.save();

    return response.status(200).json({
      message: "User data updated successfully!",
    });
  } catch (error) {
    console.log("Error", error);
    return response.status(500).json({
      message: "Server error",
    });
  }
};

// Forgot password
const forgotPassword = async (request, response) => {
  const { email } = request.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return response.status(404).json({
        message: "User not found!",
      });
    }

    // Create reset token
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetTokenExpire = Date.now() + 600000;

    await user.save();

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    const message = `We received a request to reset your password.
Please click the link below:

${resetUrl}

This link will expire in 10 minutes.
If you didn't request this, please ignore this email.`;

    try {
      await sendEmails({
        email: user.email,
        subject: "Password reset request",
        message,
      });

      return response.status(200).json({
        message: "Reset password email sent!",
      });
    } catch (error) {
      console.log("Email error", error);

      return response.status(400).json({
        message: "Error while sending email!",
      });
    }
  } catch (error) {
    console.log("Error", error);

    return response.status(500).json({
      message: "Server error!",
    });
  }
};

// Reset password
const resetPassword = async (request, response) => {
  const { token } = request.params;
  const { password } = request.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return response.status(400).json({
        message: "Invalid or expired token, please try again!",
      });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return response.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error!", error);

    return response.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  editUser,
  forgotPassword,
  resetPassword,
};
