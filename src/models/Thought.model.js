const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Thought = sequelize.define(
  "Thought",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    quote: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING, allowNull: false },
    backgroundImage: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    startDate: { type: DataTypes.STRING, defaultValue: "" },
    endDate: { type: DataTypes.STRING, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("minimal", "glass", "corporate"),
      defaultValue: "minimal",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "draft",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "thoughts" }
);

module.exports = Thought;
