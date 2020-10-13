const webSource = exports.WebSource = require("./schemas/webSource");
const product = exports.Product = require("./schemas/product");
const productInfo = exports.ProductInfo = require("./schemas/productInfo");
const notification = exports.Notifications = require("./schemas/notification");
const notificationType = exports.NotificationTypes = require("./schemas/notificationType");

product.belongsTo(webSource, {foreignKey: "sid", as:"productSourceFK"});
// webSource.hasMany(product, {as: 'product'});

productInfo.belongsTo(product, {foreignKey: 'infoId', as: "infoProduct"});
// product.hasOne(productInfo);

notification.belongsTo(product, {foreignKey: "pid", as: "notificationPid"});
notification.belongsTo(notificationType, {foreignKey: "typeId", as: "notificationTypeId"});
