const express = require("express");
const router = express.Router();
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} = require("../controllers/news.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { newsValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getNews);
router.get("/:id", protectAdmin, getNewsById);
router.post("/", protectAdmin, upload.single("image"), newsValidator, validate, createNews);
router.put("/:id", protectAdmin, upload.single("image"), updateNews);
router.delete("/:id", protectAdmin, deleteNews);

module.exports = router;
