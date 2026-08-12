const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const IndustryNews = require("../models/IndustryNews.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");
const { uploadFile } = require("../services/blob.service");

const getNews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;
  if (search) {
    where[Op.or] = [
      { headline: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
      { source: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await IndustryNews.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Industry news retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getNewsById = asyncHandler(async (req, res) => {
  const item = await IndustryNews.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "News article not found");
  return successResponse(res, 200, "News article retrieved", item);
});

const createNews = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.thumbnail = url;
    data.image = url;
  }

  const item = await IndustryNews.create(data);
  await logActivity("CREATE", "IndustryNews", `Created news headline: ${item.headline}`, req);
  emitDisplayUpdated({ module: "news", action: "create", id: item.id });

  return successResponse(res, 201, "News article created successfully", item);
});

const updateNews = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.thumbnail = url;
    data.image = url;
  }

  const item = await IndustryNews.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "News article not found");
  await item.update(data);

  await logActivity("UPDATE", "IndustryNews", `Updated news headline: ${item.headline}`, req);
  emitDisplayUpdated({ module: "news", action: "update", id: item.id });

  return successResponse(res, 200, "News article updated successfully", item);
});

const deleteNews = asyncHandler(async (req, res) => {
  const item = await IndustryNews.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "News article not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "IndustryNews", `Deleted news ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "news", action: "delete", id: item.id });

  return successResponse(res, 200, "News article deleted successfully");
});

module.exports = {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
};
