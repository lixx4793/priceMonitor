const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let notificationType = sequelize.define("notificationType", {
  notifyTypeId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  notifyType: {type: DataTypes.STRING, unique: true, allowNull: false},
  message: {type: DataTypes.STRING, allowNull: false}
});


module.exports = notificationType;
