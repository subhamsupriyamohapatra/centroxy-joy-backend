const sequelize = require("./database");
const env = require("./env");
const Admin = require("../models/Admin.model");
const Setting = require("../models/Setting.model");
const Quote = require("../models/Quote.model");

const DEFAULT_QUOTES = [
  "Code today, create the technology of tomorrow.",
  "Great software begins with a simple idea and strong execution.",
  "Every bug is an opportunity to become a better developer.",
  "Keep learning; technology never stops evolving.",
  "Think logically, code creatively, solve confidently.",
  "Build solutions that make people's lives easier.",
  "Innovation starts where curiosity meets technology.",
  "Write clean code, build reliable systems, create lasting impact.",
  "Technology changes fast; continuous learning keeps you ahead.",
  "Behind every successful application is a team that never gives up.",
  "Debugging today makes you a stronger developer tomorrow.",
  "Dream big, code smart, and build something meaningful.",
  "Good developers solve problems; great developers prevent them.",
  "Your next line of code could change everything.",
  "Learn from failures, improve your code, and keep building.",
  "Technology is powerful when knowledge meets creativity.",
  "Stay curious, keep coding, and embrace every challenge.",
  "Strong systems are built with patience, testing, and teamwork.",
  "Code is not just syntax; it is problem-solving in action.",
  "The best technology starts with people who dare to innovate.",
];

async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log(`[Database] PostgreSQL Connected: ${sequelize.config.host}:${sequelize.config.port}/${sequelize.config.database}`);

    // Create tables if they don't exist
    await sequelize.sync();

    // Ensure new columns exist on tables created by an earlier schema
    await migrateQuotesTable();

    // Seed default Admin if not exists
    await seedAdmin();
    // Seed default Setting if not exists
    await seedSetting();
    // Seed default Quotations if not exists
    await seedQuotations();
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

async function migrateQuotesTable() {
  const statements = [
    "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS template VARCHAR(255) DEFAULT ''",
    "ALTER TABLE quotes ADD COLUMN IF NOT EXISTS image VARCHAR(255) DEFAULT ''",
  ];
  for (const sql of statements) {
    try {
      await sequelize.query(sql);
    } catch (error) {
      console.error(`[Migration] Failed: ${sql} -> ${error.message}`);
    }
  }
}

async function seedQuotations() {
  try {
    const count = await Quote.count();
    if (count > 0) return;

    await Quote.bulkCreate(
      DEFAULT_QUOTES.map((quote) => ({ quote, author: "Centroxy" })),
    );
    console.log(`[Seed] Seeded ${DEFAULT_QUOTES.length} default quotations.`);
  } catch (error) {
    console.error("[Seed Error] Failed to seed Quotations:", error.message);
  }
}

module.exports = connectDB;
