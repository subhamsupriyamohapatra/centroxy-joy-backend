const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Banner = require("../models/Banner.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");
const { uploadFile } = require("../services/blob.service");

const getBanners = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;

  const { rows: items, count: total } = await Banner.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Banners retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getBannerById = asyncHandler(async (req, res) => {
  const item = await Banner.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Banner not found");
  return successResponse(res, 200, "Banner retrieved", item);
});

const createBanner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.image = url;
  }

  const item = await Banner.create(data);
  await logActivity("CREATE", "Banner", `Created banner ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "banner", action: "create", id: item.id });

  return successResponse(res, 201, "Banner created successfully", item);
});

const updateBanner = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.image = url;
  }

  const item = await Banner.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Banner not found");
  await item.update(data);

  await logActivity("UPDATE", "Banner", `Updated banner ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "banner", action: "update", id: item.id });

  return successResponse(res, 200, "Banner updated successfully", item);
});

const deleteBanner = asyncHandler(async (req, res) => {
  const item = await Banner.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Banner not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Banner", `Deleted banner ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "banner", action: "delete", id: item.id });

  return successResponse(res, 200, "Banner deleted successfully");
});

module.exports = {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
