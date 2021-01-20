const DataTypes = require("sequelize");
const sequelize = require("../sequelize");

let externalLink = sequelize.define("externalLink", {
    externalLinkId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    funType: {type: DataTypes.STRING, allowNull: false},
    productInfoUrl: {type: DataTypes.STRING, allowNull: false, unique: true},
})

module.exports = externalLink ;
