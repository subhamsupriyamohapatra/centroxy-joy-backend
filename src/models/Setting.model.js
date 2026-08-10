const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define(
  "Setting",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    companyName: { type: DataTypes.STRING, defaultValue: "Centroxy" },
    companyLogo: { type: DataTypes.TEXT, defaultValue: "/images/logo/logo.svg" },
    slideDuration: { type: DataTypes.INTEGER, defaultValue: 8 },
    theme: {
      type: DataTypes.ENUM("light", "dark", "corporate", "celebration"),
      defaultValue: "dark",
    },
    backgroundMusic: { type: DataTypes.STRING, defaultValue: "" },
    displayResolution: {
      type: DataTypes.ENUM("1920x1080", "3840x2160", "1366x768", "custom"),
      defaultValue: "1920x1080",
    },
    animationSpeed: {
      type: DataTypes.ENUM("slow", "normal", "fast"),
      defaultValue: "normal",
    },
  },
  { tableName: "settings" }
);

module.exports = Setting;
