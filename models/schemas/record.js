const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let record = sequelize.define("record", {
  recordId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  targetProductId: {type: DataTypes.INTEGER, allowNull: false, references: {modal:'product', key: "pid"}},
  acmapId: {type: DataTypes.INTEGER, allowNull: false, references: {modal: 'acmap', key: "acmapId"}},
  result: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0},
  errorMessage: {type: DataTypes.STRING}
})

module.exports = record;
