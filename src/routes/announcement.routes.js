const express = require("express");
const router = express.Router();
const {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcement.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { announcementValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getAnnouncements);
router.get("/:id", protectAdmin, getAnnouncementById);
router.post("/", protectAdmin, upload.single("image"), announcementValidator, validate, createAnnouncement);
router.put("/:id", protectAdmin, upload.single("image"), updateAnnouncement);
router.delete("/:id", protectAdmin, deleteAnnouncement);

module.exports = router;
