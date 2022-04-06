const sequelize = require("../utils/MySQL");
const { Sequelize, DataTypes } = require("sequelize");

const Url = sequelize.define(
  "Url",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,

      unique: "compositeIndex",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: "compositeIndex",
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    protocol: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { underscored: true }
);

module.exports = Url;
