const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let acmap = sequelize.define("acmap", {
  acmapId:  {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  accountId: {type: DataTypes.INTEGER, allowNull: false, references: {modal:'account', key: "accountId"}, unique: 'acComposite'},
  cardId: {type: DataTypes.INTEGER, allowNull: false, references: {modal: "card", key: "cardId"}, unique: "acComposite"}
})

module.exports = acmap;
