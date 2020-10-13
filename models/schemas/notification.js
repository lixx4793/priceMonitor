const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let notification = sequelize.define("notification", {
  notifyId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  pid: {type: DataTypes.INTEGER, references: {modal: "product", key:"notifyProduct"}, unique: 'compositeIndex'},
  typeId: {type: DataTypes.INTEGER, references: {modal: "notificationType", key:"notifyTypeFK"}, unique: 'compositeIndex'},
  active: {type: DataTypes.INTEGER,allowNull: false, defaultValue: 1}
});


module.exports = notification;
