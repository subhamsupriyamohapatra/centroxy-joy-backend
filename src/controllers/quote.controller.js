const { Op } = require("sequelize");
const asyncHandler = require("../utils/asyncHandler");
const { successResponse, errorResponse } = require("../utils/apiResponse");
const Quote = require("../models/Quote.model");
const logActivity = require("../utils/logger");

const getQuotes = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";
  const skip = (page - 1) * limit;

  const where = { isDeleted: false };
  if (search) {
    where[Op.or] = [
      { quote: { [Op.iLike]: `%${search}%` } },
      { author: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: items, count: total } = await Quote.findAndCountAll({
    where,
    order: [["createdAt", "DESC"]],
    offset: skip,
    limit,
  });

  return successResponse(res, 200, "Quotes retrieved successfully", {
    data: items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  });
});

const getQuoteById = asyncHandler(async (req, res) => {
  const item = await Quote.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Quote not found");
  return successResponse(res, 200, "Quote retrieved", item);
});

const createQuote = asyncHandler(async (req, res) => {
  const item = await Quote.create({ ...req.body });
  await logActivity("CREATE", "Quote", `Created quote ID: ${item.id}`, req);
  return successResponse(res, 201, "Quote created successfully", item);
});

const updateQuote = asyncHandler(async (req, res) => {
  const item = await Quote.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Quote not found");
  await item.update({ ...req.body });

  await logActivity("UPDATE", "Quote", `Updated quote ID: ${item.id}`, req);
  return successResponse(res, 200, "Quote updated successfully", item);
});

const deleteQuote = asyncHandler(async (req, res) => {
  const item = await Quote.findOne({ where: { id: req.params.id, isDeleted: false } });
  if (!item) return errorResponse(res, 404, "Quote not found");

  item.isDeleted = true;
  await item.save();

  await logActivity("DELETE", "Quote", `Deleted quote ID: ${item.id}`, req);
  return successResponse(res, 200, "Quote deleted successfully");
});

module.exports = {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
};