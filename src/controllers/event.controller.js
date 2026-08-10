const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Event = require("../models/Event.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const getEvents = asyncHandler(async (req, res) => {
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
      { venue: { [Op.iLike]: `%${search}%` } },
      { description: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Event.findAndCountAll({
    where,
    order: [["date", "ASC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Upcoming events retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getEventById = asyncHandler(async (req, res) => {
  const item = await Event.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Event record not found");
  return successResponse(res, 200, "Event record retrieved", item);
});

const createEvent = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.banner = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Event.create(data);
  await logActivity("CREATE", "Event", `Created upcoming event: ${item.title}`, req);
  emitDisplayUpdated({ module: "event", action: "create", id: item.id });

  return successResponse(res, 201, "Event created successfully", item);
});

const updateEvent = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.banner = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Event.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Event record not found");
  await item.update(data);

  await logActivity("UPDATE", "Event", `Updated upcoming event: ${item.title}`, req);
  emitDisplayUpdated({ module: "event", action: "update", id: item.id });

  return successResponse(res, 200, "Event updated successfully", item);
});

const deleteEvent = asyncHandler(async (req, res) => {
  const item = await Event.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Event record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Event", `Deleted event ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "event", action: "delete", id: item.id });

  return successResponse(res, 200, "Event deleted successfully");
});

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
