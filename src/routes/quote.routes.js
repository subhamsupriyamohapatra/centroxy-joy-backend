const express = require("express");
const router = express.Router();
const {
  getQuotes,
  getQuoteById,
  createQuote,
  updateQuote,
  deleteQuote,
} = require("../controllers/quote.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const { quoteValidator } = require("../validators/quote.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getQuotes);
router.get("/:id", protectAdmin, getQuoteById);
router.post("/", protectAdmin, quoteValidator, validate, createQuote);
router.put("/:id", protectAdmin, quoteValidator, validate, updateQuote);
router.delete("/:id", protectAdmin, deleteQuote);

module.exports = router;