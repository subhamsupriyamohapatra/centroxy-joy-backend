const { body } = require("express-validator");

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const thoughtValidator = [
  body("quote").notEmpty().withMessage("Quote is required").trim(),
  body("author").optional().trim(),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .matches(DATE_PATTERN)
    .withMessage("Start date must be in YYYY-MM-DD format"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .matches(DATE_PATTERN)
    .withMessage("End date must be in YYYY-MM-DD format")
    .custom((value, { req }) => {
      if (req.body.startDate && value < req.body.startDate) {
        throw new Error("End date must be on or after the start date");
      }
      return true;
    }),
];

const birthdayValidator = [
  body("employeeName").notEmpty().withMessage("Employee name is required").trim(),
  body("department").notEmpty().withMessage("Department is required").trim(),
  body("designation").notEmpty().withMessage("Designation is required").trim(),
  body("birthdayDate").notEmpty().withMessage("Birthday date is required"),
];

const employeeValidator = [
  body("employeeName").notEmpty().withMessage("Employee name is required").trim(),
  body("achievement").notEmpty().withMessage("Achievement is required").trim(),
  body("month").notEmpty().withMessage("Month is required"),
];

const customerValidator = [
  body("companyName").notEmpty().withMessage("Company name is required").trim(),
  body("projectName").notEmpty().withMessage("Project name is required").trim(),
];

const announcementValidator = [
  body("title").notEmpty().withMessage("Announcement title is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
];

const eventValidator = [
  body("title").notEmpty().withMessage("Event title is required").trim(),
  body("venue").notEmpty().withMessage("Venue is required").trim(),
  body("date").notEmpty().withMessage("Event date is required"),
  body("time").notEmpty().withMessage("Event time is required"),
];

const participationValidator = [
  body("employee").notEmpty().withMessage("Employee name is required").trim(),
  body("competition").notEmpty().withMessage("Competition is required").trim(),
  body("achievement").notEmpty().withMessage("Achievement is required").trim(),
];

const newsValidator = [
  body("headline").notEmpty().withMessage("Headline is required").trim(),
  body("description").notEmpty().withMessage("Description is required").trim(),
];

module.exports = {
  thoughtValidator,
  birthdayValidator,
  employeeValidator,
  customerValidator,
  announcementValidator,
  eventValidator,
  participationValidator,
  newsValidator,
};
