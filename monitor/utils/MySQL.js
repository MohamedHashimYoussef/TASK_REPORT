const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("bosta", "root", "P@ssw0rd", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
