const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { eventValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getEvents);
router.get("/:id", protectAdmin, getEventById);
router.post("/", protectAdmin, upload.single("image"), eventValidator, validate, createEvent);
router.put("/:id", protectAdmin, upload.single("image"), updateEvent);
router.delete("/:id", protectAdmin, deleteEvent);

module.exports = router;
