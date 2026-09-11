const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const Thought = require("../models/Thought.model");
const Birthday = require("../models/Birthday.model");
const EmployeeMonth = require("../models/EmployeeMonth.model");
const Customer = require("../models/Customer.model");
const Announcement = require("../models/Announcement.model");
const Event = require("../models/Event.model");
const Participation = require("../models/Participation.model");
const IndustryNews = require("../models/IndustryNews.model");
const Banner = require("../models/Banner.model");
const ActivityLog = require("../models/ActivityLog.model");
const { activeThoughtRange } = require("../utils/dateRange");

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [
    todayBirthdays,
    todayThought,
    upcomingEvents,
    employeeOfMonth,
    announcements,
    industryNews,
    totalThoughts,
    totalBirthdays,
    totalEmployees,
    totalCustomers,
    totalAnnouncements,
    totalEvents,
    totalParticipations,
    totalNews,
    totalBanners,
    recentActivities,
  ] = await Promise.all([
    Birthday.findAll({
      where: { isDeleted: false, status: "published" },
      order: [["createdAt", "DESC"]],
      limit: 5,
    }),
    Thought.findOne({ where: { isDeleted: false, status: "published", ...activeThoughtRange() }, order: [["createdAt", "DESC"]] }),
    Event.findAll({
      where: { isDeleted: false, status: "published" },
      order: [["date", "ASC"]],
      limit: 5,
    }),
    EmployeeMonth.findOne({ where: { isDeleted: false, status: "published" }, order: [["createdAt", "DESC"]] }),
    Announcement.findAll({
      where: { isDeleted: false, status: "published" },
      order: [["createdAt", "DESC"]],
      limit: 5,
    }),
    IndustryNews.findAll({
      where: { isDeleted: false, status: "published" },
      order: [["createdAt", "DESC"]],
      limit: 5,
    }),
    Thought.count({ where: { isDeleted: false, status: "published", ...activeThoughtRange() } }),
    Birthday.count({ where: { isDeleted: false, status: "published" } }),
    EmployeeMonth.count({ where: { isDeleted: false, status: "published" } }),
    Customer.count({ where: { isDeleted: false, status: "published" } }),
    Announcement.count({ where: { isDeleted: false, status: "published" } }),
    Event.count({ where: { isDeleted: false, status: "published" } }),
    Participation.count({ where: { isDeleted: false, status: "published" } }),
    IndustryNews.count({ where: { isDeleted: false, status: "published" } }),
    Banner.count({ where: { isDeleted: false, status: "published" } }),
    ActivityLog.findAll({ order: [["createdAt", "DESC"]], limit: 10 }),
  ]);

  const totalSlides =
    totalThoughts +
    totalBirthdays +
    totalEmployees +
    totalCustomers +
    totalAnnouncements +
    totalEvents +
    totalParticipations +
    totalNews +
    totalBanners +
    2; // Including Welcome & Thank You slides

  return successResponse(res, 200, "Dashboard data retrieved successfully", {
    todayBirthdays,
    todayThought,
    upcomingEvents,
    employeeOfMonth,
    announcements,
    industryNews,
    totalSlides,
    counts: {
      thoughts: totalThoughts,
      birthdays: totalBirthdays,
      employees: totalEmployees,
      customers: totalCustomers,
      announcements: totalAnnouncements,
      events: totalEvents,
      participations: totalParticipations,
      news: totalNews,
      banners: totalBanners,
    },
    recentActivities,
  });
});

module.exports = { getDashboardSummary };
