const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Admin = require("./Admin.model");

const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    action: { type: DataTypes.STRING, allowNull: false },
    module: { type: DataTypes.STRING, allowNull: false },
    details: { type: DataTypes.TEXT, defaultValue: "" },
    adminId: { type: DataTypes.UUID, allowNull: true, defaultValue: null },
    ipAddress: { type: DataTypes.STRING, defaultValue: "" },
    timestamp: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "activity_logs" }
);

ActivityLog.belongsTo(Admin, { foreignKey: "adminId", as: "admin" });

module.exports = ActivityLog;
