const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Quote = sequelize.define(
  "Quote",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quote: { type: DataTypes.TEXT, allowNull: false },
    author: { type: DataTypes.STRING, defaultValue: "" },
    template: { type: DataTypes.STRING, defaultValue: "" },
    image: { type: DataTypes.STRING, defaultValue: "" },
    status: { type: DataTypes.STRING, defaultValue: "active" },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "quotes", timestamps: true }
);

module.exports = Quote;