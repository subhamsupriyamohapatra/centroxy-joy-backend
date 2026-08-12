const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const EmployeeMonth = require("../models/EmployeeMonth.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");
const { uploadFile } = require("../services/blob.service");

const getEmployees = asyncHandler(async (req, res) => {
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
      { achievement: { [Op.iLike]: `%${search}%` } },
      { month: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await EmployeeMonth.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Employees of the Month retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getEmployeeById = asyncHandler(async (req, res) => {
  const item = await EmployeeMonth.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Employee record not found");
  return successResponse(res, 200, "Employee record retrieved", item);
});

const createEmployee = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.photo = url;
    data.image = url;
  }

  const item = await EmployeeMonth.create(data);
  await logActivity("CREATE", "EmployeeMonth", `Created Employee of Month for ${item.employeeName}`, req);
  emitDisplayUpdated({ module: "employee", action: "create", id: item.id });

  return successResponse(res, 201, "Employee of the Month created successfully", item);
});

const updateEmployee = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    const url = await uploadFile(req.file);
    data.photo = url;
    data.image = url;
  }

  const item = await EmployeeMonth.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Employee record not found");
  await item.update(data);

  await logActivity("UPDATE", "EmployeeMonth", `Updated Employee of Month for ${item.employeeName}`, req);
  emitDisplayUpdated({ module: "employee", action: "update", id: item.id });

  return successResponse(res, 200, "Employee of the Month updated successfully", item);
});

const deleteEmployee = asyncHandler(async (req, res) => {
  const item = await EmployeeMonth.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Employee record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "EmployeeMonth", `Deleted Employee ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "employee", action: "delete", id: item.id });

  return successResponse(res, 200, "Employee of the Month deleted successfully");
});

module.exports = {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
