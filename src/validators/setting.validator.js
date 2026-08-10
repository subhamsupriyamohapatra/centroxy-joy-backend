const { body } = require("express-validator");

const settingValidator = [
  body("companyName").optional().trim(),
  body("slideDuration").optional().isNumeric().withMessage("Slide duration must be a number"),
];

module.exports = { settingValidator };
