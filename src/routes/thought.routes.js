const express = require("express");
const router = express.Router();
const {
  getThoughts,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
} = require("../controllers/thought.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { thoughtValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getThoughts);
router.get("/:id", protectAdmin, getThoughtById);
router.post("/", protectAdmin, upload.single("image"), thoughtValidator, validate, createThought);
router.put("/:id", protectAdmin, upload.single("image"), thoughtValidator, validate, updateThought);
router.delete("/:id", protectAdmin, deleteThought);

module.exports = router;
