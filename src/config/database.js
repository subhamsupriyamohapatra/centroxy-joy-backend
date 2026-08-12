const { Sequelize } = require("sequelize");
const env = require("./env");

const options = {
  dialect: "postgres",
  logging: false,
};

if (process.env.NODE_ENV === "production") {
  options.dialectOptions = {
    ssl: { require: true, rejectUnauthorized: false },
  };
}

const sequelize = env.databaseUrl
  ? new Sequelize(env.databaseUrl, options)
  : new Sequelize(env.db.name, env.db.user, env.db.password, {
      host: env.db.host,
      port: env.db.port,
      ...options,
    });

module.exports = sequelize;
