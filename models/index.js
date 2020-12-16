const webSource = exports.WebSource = require("./schemas/webSource");
const product = exports.Product = require("./schemas/product");
const productInfo = exports.ProductInfo = require("./schemas/productInfo");
const notification = exports.Notifications = require("./schemas/notification");
const notificationType = exports.NotificationTypes = require("./schemas/notificationType");
const account = exports.Account = require("./schemas/account");
const card = exports.Card = require("./schemas/card");
const acmap = exports.Acmap = require("./schemas/acmap");
const record = exports.Record = require("./schemas/record");


product.belongsTo(webSource, {foreignKey: "sid", as:"productSourceFK"});
// webSource.hasMany(product, {as: 'product'});

productInfo.belongsTo(product, {foreignKey: 'infoId', as: "infoProduct"});
// product.hasOne(productInfo);

notification.belongsTo(product, {foreignKey: "pid", as: "notificationPid"});
notification.belongsTo(notificationType, {foreignKey: "typeId", as: "notificationTypeId"});

acmap.belongsTo(account, {foreignKey: "accountId"});
acmap.belongsTo(card, {foreignKey: "cardId"});

// account.hasMany(acmap);
// card.hasMany(acmap);
// //
record.belongsTo(product, {foreignKey: "targetProductId", targetKey: "pid"});
record.belongsTo(acmap, {foreignKey: "acmapId"});
// acmap.hasMany(record);

const sequelize = exports.sequelize = require('./sequelize');
// sequelize.sync({force: true}).then(function () {
//     console.log('init ok');
// });
