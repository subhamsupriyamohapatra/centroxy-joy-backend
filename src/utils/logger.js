const ActivityLog = require("../models/ActivityLog.model");

async function logActivity(action, moduleName, details = "", req = null) {
  try {
    const adminId = req?.user?.id || null;
    const ipAddress = req?.headers["x-forwarded-for"] || req?.socket?.remoteAddress || "";

    await ActivityLog.create({
      action,
      module: moduleName,
      details: typeof details === "object" ? JSON.stringify(details) : String(details),
      adminId,
      ipAddress,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("[Logger Error] Failed to record activity log:", error.message);
  }
}

module.exports = logActivity;
