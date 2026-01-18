const User = require("../models/User.js");

// Dashboard controller
const dashboard = async (request, response) => {
  try {
    const user = await User.findById(request.user.id);

    if (!user) {
      return response.status(404).json({
        message: "User not found!",
      });
    }

    return response.status(200).json({
      user,
      message: "Welcome to dashboard!",
    });
  } catch (error) {
    console.log("Error in dashboard page....", error);

    return response.status(500).json({
      message: "Something went wrong in dashboard page...",
    });
  }
};

module.exports = dashboard;
