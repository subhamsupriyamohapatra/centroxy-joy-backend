const express = require("express");
const router = express.Router();

const authRoutes = require("./auth.routes");
const dashboardRoutes = require("./dashboard.routes");
const displayRoutes = require("./display.routes");
const thoughtRoutes = require("./thought.routes");
const birthdayRoutes = require("./birthday.routes");
const employeeRoutes = require("./employee.routes");
const customerRoutes = require("./customer.routes");
const announcementRoutes = require("./announcement.routes");
const eventRoutes = require("./event.routes");
const participationRoutes = require("./participation.routes");
const newsRoutes = require("./news.routes");
const bannerRoutes = require("./banner.routes");
const quoteRoutes = require("./quote.routes");
const settingRoutes = require("./setting.routes");
const zohoRoutes = require("./zoho.routes");

router.use("/auth", authRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/display", displayRoutes);
router.use("/thoughts", thoughtRoutes);
router.use("/birthdays", birthdayRoutes);
router.use("/employees", employeeRoutes);
router.use("/customers", customerRoutes);
router.use("/announcements", announcementRoutes);
router.use("/events", eventRoutes);
router.use("/participation", participationRoutes);
router.use("/news", newsRoutes);
router.use("/banners", bannerRoutes);
router.use("/quotes", quoteRoutes);
router.use("/settings", settingRoutes);
router.use("/zoho", zohoRoutes);

module.exports = router;
