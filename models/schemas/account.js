const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let account = sequelize.define("account", {
  accountId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  email: {type: DataTypes.STRING},
  owner: {type: DataTypes.STRING, unique: true, allowNull: false},
  active: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
  note: {type: DataTypes.STRING},
})

module.exports = account;
