const express = require("express");
const router = express.Router();
const { syncZohoBirthdays } = require("../controllers/zoho.controller");
const { protectAdmin } = require("../middleware/auth.middleware");

router.post("/sync", protectAdmin, syncZohoBirthdays);

module.exports = router;
