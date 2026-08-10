const express = require("express");
const router = express.Router();
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const { protectAdmin } = require("../middleware/auth.middleware");

router.get("/", protectAdmin, getDashboardSummary);

module.exports = router;
