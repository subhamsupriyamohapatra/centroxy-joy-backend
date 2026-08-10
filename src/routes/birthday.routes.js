const express = require("express");
const router = express.Router();
const {
  getBirthdays,
  getBirthdayById,
  createBirthday,
  updateBirthday,
  deleteBirthday,
} = require("../controllers/birthday.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { birthdayValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getBirthdays);
router.get("/:id", protectAdmin, getBirthdayById);
router.post("/", protectAdmin, upload.single("image"), birthdayValidator, validate, createBirthday);
router.put("/:id", protectAdmin, upload.single("image"), updateBirthday);
router.delete("/:id", protectAdmin, deleteBirthday);

module.exports = router;
