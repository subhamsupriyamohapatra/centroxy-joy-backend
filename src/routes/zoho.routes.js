const express = require("express");
const router = express.Router();
const env = require("../config/env");
const { syncZohoBirthdays } = require("../controllers/zoho.controller");
const { protectAdmin } = require("../middleware/auth.middleware");

function protectCron(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const provided = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.headers["x-cron-secret"];
  if (env.cronSecret && provided === env.cronSecret) {
    return next();
  }
  return res.status(401).json({ success: false, message: "Unauthorized" });
}

router.post("/sync", protectAdmin, syncZohoBirthdays);
router.post("/cron", protectCron, syncZohoBirthdays);

module.exports = router;
