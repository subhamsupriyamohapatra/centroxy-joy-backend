const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../../.env") });

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "",
  db: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    name: process.env.DB_NAME || "centroxy_joy_portal",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
  },
  jwtSecret: process.env.JWT_SECRET || "centroxy_default_secret_key_2026",
  jwtExpires: process.env.JWT_EXPIRES || "24h",
  adminUsername: process.env.ADMIN_USERNAME || "centroxy",
  adminPassword: process.env.ADMIN_PASSWORD || "centroxy2026",
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",
  blobToken: process.env.BLOB_READ_WRITE_TOKEN || "",
  cronSecret: process.env.CRON_SECRET || "",
  zoho: {
    clientId: process.env.ZOHO_CLIENT_ID || "",
    clientSecret: process.env.ZOHO_CLIENT_SECRET || "",
    refreshToken: process.env.ZOHO_REFRESH_TOKEN || "",
    orgId: process.env.ZOHO_ORG_ID || "",
  },
};
