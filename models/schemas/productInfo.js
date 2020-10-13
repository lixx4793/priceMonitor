/*
  Yuhao Li
  2020/09/15
*/

let DataTypes = require('sequelize');
let sequelize = require('../sequelize');
let productInfo = sequelize.define('product_info', {
  infoId: {type: DataTypes.INTEGER, primaryKey: true, allowNull: false, references: {modal:'product',key:'pid'}},
  upc: {type: DataTypes.STRING},
  description: {type: DataTypes.STRING},
  need_update: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}


});

module.exports = productInfo;
