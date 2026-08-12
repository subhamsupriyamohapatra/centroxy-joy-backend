const app = require("../src/app");
const connectDB = require("../src/config/db");

let dbPromise = null;

function ensureDatabase() {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureDatabase();
  } catch (error) {
    console.error("[Vercel] Database connection failed:", error.message);
    return res.status(500).json({ success: false, message: "Database connection failed" });
  }
  return app(req, res);
};
