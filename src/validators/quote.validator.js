const { body } = require("express-validator");

function countWords(value) {
  return value.trim().split(/\s+/).filter(Boolean).length;
}

const quoteValidator = [
  body("quote")
    .notEmpty()
    .withMessage("Quote is required")
    .trim()
    .custom((value) => {
      if (countWords(value) > 12) {
        throw new Error("Quote cannot be more than 12 words");
      }
      return true;
    }),
  body("author").optional().trim(),
];

module.exports = { quoteValidator };