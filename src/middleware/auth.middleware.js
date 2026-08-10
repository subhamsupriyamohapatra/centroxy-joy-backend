const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { errorResponse } = require("../utils/apiResponse");
const Admin = require("../models/Admin.model");

const safeAdminAttributes = { exclude: ["password"] };

async function findDefaultAdmin() {
  return Admin.findOne({ where: { username: env.adminUsername }, attributes: safeAdminAttributes });
}

async function protectAdmin(req, res, next) {
  let token = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    if (env.nodeEnv === "development") {
      const admin = await findDefaultAdmin();
      if (admin) {
        req.user = admin;
        return next();
      }
    }
    return errorResponse(res, 401, "Not authorized, token missing");
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const admin = await Admin.findByPk(decoded.id, { attributes: safeAdminAttributes });

    if (!admin) {
      if (env.nodeEnv === "development") {
        const defaultAdmin = await findDefaultAdmin();
        if (defaultAdmin) {
          req.user = defaultAdmin;
          return next();
        }
      }
      return errorResponse(res, 401, "Not authorized, user no longer exists");
    }

    req.user = admin;
    next();
  } catch (error) {
    if (env.nodeEnv === "development") {
      const defaultAdmin = await findDefaultAdmin();
      if (defaultAdmin) {
        req.user = defaultAdmin;
        return next();
      }
    }
    return errorResponse(res, 401, "Not authorized, token invalid or expired");
  }
}

module.exports = { protectAdmin };
