const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Birthday = require("../models/Birthday.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");
const { uploadFile } = require("../services/blob.service");

const getBirthdays = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;
  if (search) {
    where[Op.or] = [
      { employeeName: { [Op.iLike]: `%${search}%` } },
      { department: { [Op.iLike]: `%${search}%` } },
      { designation: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Birthday.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Birthdays retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getBirthdayById = asyncHandler(async (req, res) => {
  const item = await Birthday.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Birthday record not found");
  return successResponse(res, 200, "Birthday record retrieved", item);
});

const createBirthday = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.employeePhoto = url;
    data.image = url;
  }

  const item = await Birthday.create(data);
  await logActivity("CREATE", "Birthday", `Created birthday greeting for ${item.employeeName}`, req);
  emitDisplayUpdated({ module: "birthday", action: "create", id: item.id });

  return successResponse(res, 201, "Birthday created successfully", item);
});

const updateBirthday = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.employeePhoto = url;
    data.image = url;
  }

  const item = await Birthday.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Birthday record not found");
  await item.update(data);

  await logActivity("UPDATE", "Birthday", `Updated birthday greeting for ${item.employeeName}`, req);
  emitDisplayUpdated({ module: "birthday", action: "update", id: item.id });

  return successResponse(res, 200, "Birthday updated successfully", item);
});

const deleteBirthday = asyncHandler(async (req, res) => {
  const item = await Birthday.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Birthday record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Birthday", `Deleted birthday ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "birthday", action: "delete", id: item.id });

  return successResponse(res, 200, "Birthday deleted successfully");
});

module.exports = {
  getBirthdays,
  getBirthdayById,
  createBirthday,
  updateBirthday,
  deleteBirthday,
};
