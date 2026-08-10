const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const displayService = require("../services/display.service");

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const slides = await displayService.getPublishedSlides();
    return successResponse(res, 200, "Published display slides retrieved", slides);
  })
);

module.exports = router;
