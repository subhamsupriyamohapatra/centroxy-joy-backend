const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Participation = require("../models/Participation.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const getParticipations = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;
  if (search) {
    where[Op.or] = [
      { employee: { [Op.iLike]: `%${search}%` } },
      { competition: { [Op.iLike]: `%${search}%` } },
      { achievement: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Participation.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Participation records retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getParticipationById = asyncHandler(async (req, res) => {
  const item = await Participation.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Participation record not found");
  return successResponse(res, 200, "Participation record retrieved", item);
});

const createParticipation = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.photo = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Participation.create(data);
  await logActivity("CREATE", "Participation", `Created achievement for ${item.employee}`, req);
  emitDisplayUpdated({ module: "participation", action: "create", id: item.id });

  return successResponse(res, 201, "Participation record created successfully", item);
});

const updateParticipation = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.photo = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Participation.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Participation record not found");
  await item.update(data);

  await logActivity("UPDATE", "Participation", `Updated achievement for ${item.employee}`, req);
  emitDisplayUpdated({ module: "participation", action: "update", id: item.id });

  return successResponse(res, 200, "Participation record updated successfully", item);
});

const deleteParticipation = asyncHandler(async (req, res) => {
  const item = await Participation.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Participation record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Participation", `Deleted participation ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "participation", action: "delete", id: item.id });

  return successResponse(res, 200, "Participation record deleted successfully");
});

module.exports = {
  getParticipations,
  getParticipationById,
  createParticipation,
  updateParticipation,
  deleteParticipation,
};
