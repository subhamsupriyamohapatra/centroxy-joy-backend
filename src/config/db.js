const sequelize = require("./database");
const env = require("./env");
const Admin = require("../models/Admin.model");
const Setting = require("../models/Setting.model");

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`[Database] PostgreSQL Connected: ${sequelize.config.host}:${sequelize.config.port}/${sequelize.config.database}`);

    // Create tables if they don't exist
    await sequelize.sync();

    // Seed default Admin if not exists
    await seedAdmin();
    // Seed default Setting if not exists
    await seedSetting();
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    throw error;
  }
}

async function seedAdmin() {
  try {
    const existingAdmin = await Admin.findOne({ where: { username: env.adminUsername } });
    if (!existingAdmin) {
      console.log(`[Seed] Creating default Admin user (${env.adminUsername})...`);
      const admin = await Admin.create({
        username: env.adminUsername,
        password: env.adminPassword,
        name: "Centroxy Admin",
        role: "admin",
      });
      console.log("[Seed] Admin user seeded successfully!");
    }
  } catch (error) {
    console.error("[Seed Error] Failed to seed Admin:", error.message);
  }
}

async function seedSetting() {
  try {
    const count = await Setting.count();
    if (count === 0) {
      await Setting.create({
        companyName: "Centroxy",
        companyLogo: "/images/logo/logo.svg",
        slideDuration: 8,
        theme: "dark",
        backgroundMusic: "",
        displayResolution: "1920x1080",
        animationSpeed: "normal",
      });
      console.log("[Seed] Default portal settings initialized.");
    }
  } catch (error) {
    console.error("[Seed Error] Failed to seed Setting:", error.message);
  }
}

module.exports = connectDB;
