const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Event = sequelize.define(
  "Event",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    banner: { type: DataTypes.TEXT, defaultValue: "" },
    image: { type: DataTypes.TEXT, defaultValue: "" },
    venue: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, defaultValue: "" },
    template: {
      type: DataTypes.ENUM("event-card", "poster", "timeline", "corporate"),
      defaultValue: "event-card",
    },
    status: {
      type: DataTypes.ENUM("draft", "scheduled", "published", "archived"),
      defaultValue: "published",
    },
    isDeleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { tableName: "events" }
);

module.exports = Event;
