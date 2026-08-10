const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Customer = require("../models/Customer.model");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const status = req.query.status || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (status && status !== "all") where.status = status;
  if (search) {
    where[Op.or] = [
      { companyName: { [Op.iLike]: `%${search}%` } },
      { projectName: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Customer.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Customers retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getCustomerById = asyncHandler(async (req, res) => {
  const item = await Customer.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Customer record not found");
  return successResponse(res, 200, "Customer record retrieved", item);
});

const createCustomer = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.companyLogo = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Customer.create(data);
  await logActivity("CREATE", "Customer", `Created new customer welcome for ${item.companyName}`, req);
  emitDisplayUpdated({ module: "customer", action: "create", id: item.id });

  return successResponse(res, 201, "Customer created successfully", item);
});

const updateCustomer = asyncHandler(async (req, res) => {
  const data = { ...req.body };
  if (req.file) {
    data.companyLogo = `/uploads/${req.file.filename}`;
    data.image = `/uploads/${req.file.filename}`;
  }

  const item = await Customer.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Customer record not found");
  await item.update(data);

  await logActivity("UPDATE", "Customer", `Updated customer welcome for ${item.companyName}`, req);
  emitDisplayUpdated({ module: "customer", action: "update", id: item.id });

  return successResponse(res, 200, "Customer updated successfully", item);
});

const deleteCustomer = asyncHandler(async (req, res) => {
  const item = await Customer.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Customer record not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Customer", `Deleted customer ID: ${item.id}`, req);
  emitDisplayUpdated({ module: "customer", action: "delete", id: item.id });

  return successResponse(res, 200, "Customer deleted successfully");
});

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
