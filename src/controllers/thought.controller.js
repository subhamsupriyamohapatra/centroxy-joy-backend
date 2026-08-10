const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Thought = require("../models/Thought.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const getThoughts = asyncHandler(async (req, res) => {
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
      { quote: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Thought.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Thoughts retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getThoughtById = asyncHandler(async (req, res) => {
  const item = await Thought.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Thought not found");
  return successResponse(res, 200, "Thought retrieved", item);
});

const createThought = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.backgroundImage = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Thought.create(data);
  await logActivity("CREATE", "Thought", `Created thought ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "thought", action: "create", id: item.id });

  return successResponse(res, 201, "Thought created successfully", item);
});

const updateThought = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.backgroundImage = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Thought.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Thought not found");
  await item.update(data);

  await logActivity("UPDATE", "Thought", `Updated thought ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "thought", action: "update", id: item.id });

  return successResponse(res, 200, "Thought updated successfully", item);
});

const deleteThought = asyncHandler(async (req, res) => {
  const item = await Thought.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Thought not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Thought", `Deleted thought ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "thought", action: "delete", id: item.id });

  return successResponse(res, 200, "Thought deleted successfully");
});

module.exports = {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
};
