const cron = require("node-cron");
const zohoService = require("../services/zoho.service");
const { emitDisplayUpdated } = require("../config/socket");

function initBirthdayCron() {
  // Run every day at 08:00 AM
  cron.schedule("0 8 * * *", async () => {
    console.log("[Cron Job] Running daily 08:00 AM Zoho birthday sync...");
    try {
      const result = await zohoService.syncBirthdays();
      console.log(`[Cron Job Result] ${result.message}`);
      if (result.syncedCount > 0) {
        emitDisplayUpdated({ source: "cron-job", syncedCount: result.syncedCount });
      }
    } catch (error) {
      console.error("[Cron Job Error] Failed to execute birthday sync:", error.message);
    }
  });

  console.log("[Cron Job] Zoho Birthday Sync scheduled for 08:00 AM daily.");
}

module.exports = initBirthdayCron;
