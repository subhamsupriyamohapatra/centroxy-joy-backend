const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Announcement = sequelize.define(
  "Announcement",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    bannerImage: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    description: { type: DataTypes.TEXT, allowNull: false },
    priority: {
      type: DataTypes.ENUM("low", "medium", "high", "critical"),
      defaultValue: "medium",
    },
    publishDate: { type: DataTypes.STRING, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("notice", "banner", "breaking-news", "corporate"),
      defaultValue: "notice",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "announcements" }
);

module.exports = Announcement;
