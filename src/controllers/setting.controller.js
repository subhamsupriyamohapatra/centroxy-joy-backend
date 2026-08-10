const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Setting = require("../models/Setting.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const getSettings = asyncHandler(async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create({
      companyName: "Centroxy",
      companyLogo: "/images/logo/logo.svg",
      slideDuration: 8,
      theme: "dark",
      backgroundMusic: "",
      displayResolution: "1920x1080",
      animationSpeed: "normal",
    });
  }
  return successResponse(res, 200, "Portal settings retrieved", setting);
});

const updateSettings = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.companyLogo = `/uploads/${req.file.filename}`;
  }

  let setting = await Setting.findOne();
  if (!setting) {
    setting = await Setting.create(data);
  } else {
    setting = await setting.update(data);
  }

  await logActivity("UPDATE", "Settings", "Updated portal settings", req);
  emitDisplayUpdated({ module: "setting", action: "update" });

  return successResponse(res, 200, "Portal settings updated successfully", setting);
});

module.exports = {
  getSettings,
  updateSettings,
};
