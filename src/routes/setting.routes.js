const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/setting.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { settingValidator } = require("../validators/setting.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", getSettings); // Public display access
router.put("/", protectAdmin, upload.single("logo"), settingValidator, validate, updateSettings);

module.exports = router;
