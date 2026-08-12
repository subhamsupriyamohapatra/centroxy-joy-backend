const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Announcement = require("../models/Announcement.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");
const { uploadFile } = require("../services/blob.service");

const getAnnouncements = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;
  if (search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Announcement.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Announcements retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getAnnouncementById = asyncHandler(async (req, res) => {
  const item = await Announcement.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Announcement record not found");
  return successResponse(res, 200, "Announcement record retrieved", item);
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.bannerImage = url;
    data.image = url;
  }

  const item = await Announcement.create(data);
  await logActivity("CREATE", "Announcement", `Created announcement: ${item.title}`, req);
  emitDisplayUpdated({ module: "announcement", action: "create", id: item.id });

  return successResponse(res, 201, "Announcement created successfully", item);
});

const updateAnnouncement = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.bannerImage = url;
    data.image = url;
  }

  const item = await Announcement.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Announcement record not found");
  await item.update(data);

  await logActivity("UPDATE", "Announcement", `Updated announcement: ${item.title}`, req);
  emitDisplayUpdated({ module: "announcement", action: "update", id: item.id });

  return successResponse(res, 200, "Announcement updated successfully", item);
});

const deleteAnnouncement = asyncHandler(async (req, res) => {
  const item = await Announcement.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Announcement record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Announcement", `Deleted announcement ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "announcement", action: "delete", id: item.id });

  return successResponse(res, 200, "Announcement deleted successfully");
});

module.exports = {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
