const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const EmployeeMonth = sequelize.define(
  "EmployeeMonth",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    photo: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    achievement: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    month: { type: DataTypes.STRING, allowNull: false },
    template: {
      type: DataTypes.ENUM("award", "spotlight", "corporate", "premium"),
      defaultValue: "spotlight",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "employee_months" }
);

module.exports = EmployeeMonth;
