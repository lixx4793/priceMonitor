const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let card = sequelize.define("card", {
  cardId:  {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  cardFirstName: {type: DataTypes.STRING, allowNull: false},
  cardLastName: {type: DataTypes.STRING, allowNull: false},
  cardNumber: {type: DataTypes.STRING, allowNull: false, unique: true},
  cvv: {type: DataTypes.STRING, allowNull: false},
  expireMonth: {type: DataTypes.INTEGER, allowNull: false},
  expireYear: {type: DataTypes.INTEGER, allowNull: false},
  type: {type: DataTypes.STRING}
})

module.exports = card;
