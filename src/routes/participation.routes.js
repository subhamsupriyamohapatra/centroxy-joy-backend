const express = require("express");
const router = express.Router();
const {
  getParticipations,
  getParticipationById,
  createParticipation,
  updateParticipation,
  deleteParticipation,
} = require("../controllers/participation.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const { participationValidator } = require("../validators/module.validator");
const validate = require("../middleware/validate.middleware");

router.get("/", protectAdmin, getParticipations);
router.get("/:id", protectAdmin, getParticipationById);
router.post("/", protectAdmin, upload.single("image"), participationValidator, validate, createParticipation);
router.put("/:id", protectAdmin, upload.single("image"), updateParticipation);
router.delete("/:id", protectAdmin, deleteParticipation);

module.exports = router;
