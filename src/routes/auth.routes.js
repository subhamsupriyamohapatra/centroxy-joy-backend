const express = require("express");
const router = express.Router();
const { loginAdmin, logoutAdmin, getAdminProfile } = require("../controllers/auth.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const { loginValidator } = require("../validators/auth.validator");
const validate = require("../middleware/validate.middleware");

router.post("/login", loginValidator, validate, loginAdmin);
router.post("/logout", protectAdmin, logoutAdmin);
router.get("/me", protectAdmin, getAdminProfile);

module.exports = router;
