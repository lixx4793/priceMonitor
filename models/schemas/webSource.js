/**
  Yuhao Li
  2020/09/15
**/

let DataTypes = require('sequelize');
let sequelize = require('../sequelize');
let webSource = sequelize.define('web_source', {
  sourceId: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  entryUrl: {type: DataTypes.STRING, unique: true, allowNull: false},
  company: {type: DataTypes.STRING, allowNull: false},
  scriptFunType: {type: DataTypes.STRING, allowNull: false},
  orderFunType: {type: DataTypes.STRING, allowNull: false},
});

module.exports = webSource;
