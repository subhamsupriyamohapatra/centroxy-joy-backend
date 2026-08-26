const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Banner = sequelize.define(
  "Banner",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "draft",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "banners" }
);

module.exports = Banner;
