const jwt = require("jsonwebtoken");
const env = require("../config/env");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Admin = require("../models/Admin.model");
const logActivity = require("../utils/logger");

const loginAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const admin = await Admin.findOne({ where: { username } });
  if (!admin) {
    await logActivity("FAILED_LOGIN", "Auth", `Attempted username: ${username}`, req);
    return errorResponse(res, 401, "Invalid username or password");
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    await logActivity("FAILED_LOGIN", "Auth", `Failed password for user: ${username}`, req);
    return errorResponse(res, 401, "Invalid username or password");
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpires }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.nodeEnv === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });

  await logActivity("LOGIN_SUCCESS", "Auth", `Admin ${username} logged in successfully`, req);

  return successResponse(res, 200, "Login successful", {
    token,
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
    },
  });
});

const logoutAdmin = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  await logActivity("LOGOUT", "Auth", "Admin logged out", req);
  return successResponse(res, 200, "Logout successful");
});

const getAdminProfile = asyncHandler(async (req, res) => {
  return successResponse(res, 200, "Admin profile retrieved", { user: req.user });
});

module.exports = {
  loginAdmin,
  logoutAdmin,
  getAdminProfile,
};
