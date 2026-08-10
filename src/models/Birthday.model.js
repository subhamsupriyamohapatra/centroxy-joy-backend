const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Birthday = sequelize.define(
  "Birthday",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    employeeName: { type: DataTypes.STRING, allowNull: false },
    employeePhoto: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    department: { type: DataTypes.STRING, allowNull: false },
    designation: { type: DataTypes.STRING, allowNull: false },
    greetingMessage: { type: DataTypes.TEXT, defaultValue: "Wishing you a fantastic birthday!" },
    birthdayDate: { type: DataTypes.STRING, allowNull: false },
    backgroundTheme: { type: DataTypes.STRING, defaultValue: "default" },
    scheduleDate: { type: DataTypes.STRING, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("classic", "celebration", "corporate", "premium", "modern"),
      defaultValue: "celebration",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "birthdays" }
);

module.exports = Birthday;
