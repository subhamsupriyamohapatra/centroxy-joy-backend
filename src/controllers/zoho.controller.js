const asyncHandler = require("../utils/asyncHandler");
const { successResponse } = require("../utils/apiResponse");
const zohoService = require("../services/zoho.service");
const logActivity = require("../utils/logger");
const { emitDisplayUpdated } = require("../config/socket");

const syncZohoBirthdays = asyncHandler(async (req, res) => {
  const result = await zohoService.syncBirthdays();
  await logActivity("ZOHO_SYNC", "Zoho", `Synced ${result.syncedCount} birthday records`, req);

  if (result.syncedCount > 0) {
    emitDisplayUpdated({ module: "zoho", action: "sync" });
  }

  return successResponse(res, 200, result.message, result);
});

module.exports = { syncZohoBirthdays };
