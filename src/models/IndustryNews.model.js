const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const IndustryNews = sequelize.define(
  "IndustryNews",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    headline: { type: DataTypes.STRING, allowNull: false },
    thumbnail: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    description: { type: DataTypes.TEXT, allowNull: false },
    source: { type: DataTypes.STRING, defaultValue: "Industry News" },
    publishDate: { type: DataTypes.STRING, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("news-card", "magazine", "corporate"),
      defaultValue: "news-card",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "industry_news" }
);

module.exports = IndustryNews;
