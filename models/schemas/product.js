let DataTypes = require('sequelize');
let sequelize = require('../sequelize');
let product = sequelize.define('product', {
  pid: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  sid: {type: DataTypes.INTEGER, references: {modal:'webSource', key: "sourceId"}, unique: 'compositeIndex'},
  productTitle: {type: DataTypes.STRING, allowNull: false, unique: true},
  url: {type: DataTypes.STRING, allowNull:false},
  productInfoUrl: {type: DataTypes.STRING, allowNull: false, unique: 'compositeIndex'},
  currentPrice: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  oldPrice: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  highPrice: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  lowPrice: {type: DataTypes.DECIMAL(10,2), allowNull: false},
  discountPrice: {type: DataTypes.DECIMAL(10,2)},
  discountDes: {type: DataTypes.STRING},
  stockInfo: {type: DataTypes.STRING},
  imageSrc: {type: DataTypes.STRING},
  active: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 1},
  targetPrice: {type: DataTypes.DECIMAL(10,2)},
  automaticOrder: {type: DataTypes.INTEGER, defaultValue: 0, allowNull: false},
  note:  DataTypes.STRING,
  autoOrderPrice: DataTypes.DECIMAL(10,2)
});

module.exports = product;
