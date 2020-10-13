const config = require('dotenv').config({path: __dirname + "/../.env"});
const Sequelize = require('sequelize');
const pool = {
  host:'127.0.0.1',
  port:'3306',
  logging:false
}

const sequelize = new Sequelize(
  config.parsed.DATABASE,
  config.parsed.USER,
  config.parsed.PASSWORD,
  pool
);

module.exports = sequelize;
