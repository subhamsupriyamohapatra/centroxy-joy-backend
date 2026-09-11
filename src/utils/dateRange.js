const { Op } = require("sequelize");

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function openDate(field, operator) {
  return { [Op.or]: [{ [field]: "" }, { [field]: null }, { [field]: { [Op[operator]]: todayString() } }] };
}

function activeThoughtRange() {
  return {
    [Op.and]: [openDate("startDate", "lte"), openDate("endDate", "gte")],
  };
}

module.exports = { todayString, activeThoughtRange };