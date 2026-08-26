const express = require("express");
const router = express.Router();
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/banner.controller");
const { protectAdmin } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.get("/", protectAdmin, getBanners);
router.get("/:id", protectAdmin, getBannerById);
router.post("/", protectAdmin, upload.single("image"), createBanner);
router.put("/:id", protectAdmin, upload.single("image"), updateBanner);
router.delete("/:id", protectAdmin, deleteBanner);

module.exports = router;
