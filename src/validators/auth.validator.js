const { body } = require("express-validator");

const loginValidator = [
  body("username").notEmpty().withMessage("Username is required").trim(),
  body("password").notEmpty().withMessage("Password is required"),
];

module.exports = { loginValidator };
