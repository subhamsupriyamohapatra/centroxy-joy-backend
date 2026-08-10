const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Participation = sequelize.define(
  "Participation",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employee: { type: DataTypes.STRING, allowNull: false },
    competition: { type: DataTypes.STRING, allowNull: false },
    achievement: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("achievement", "gallery", "award"),
      defaultValue: "achievement",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "participations" }
);

module.exports = Participation;
