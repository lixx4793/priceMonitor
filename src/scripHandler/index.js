const express = require("express");
const router = express.Router();
const models = require('../../models');

const nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
    host: 'mocha9004.mochahost.com',
    port: 465,
    secure: true,
    auth: {
            user:'no-reply@speedersolutions.com',
            pass:'no-reply'
        }
});

router.get("/fetchProduct", async(req, res) => {
  let search = {}
  if(req.query.sid != null) {
    search.sid = req.query.sid
  }
  try {
    let productData = await models.Product.findAll({
      where: search,
    });
    res.send({
      status: true,
      data: productData
    })
  } catch(e) {
    res.send({
      status: false,
      error: e
    })
  }
});

router.get("/fetchExternalLink", async(req, res) => {
    if(req.query.funType == null) {
        return res.status(500).send({
            status: false,
            error: "Invalid Params"
        })
    }
    let result;
    try {
        result = await models.ExternalLink.findAll({
            where: {
                funType: req.query.funType
            }
        })
    } catch(e) {
        return res.status(500).send({
            status: false,
            error: e
        })
    }
    res.send({
        data: result
    })
});

router.get("/fetchWebSource", async(req, res) => {
  try {
    let sources = await models.WebSource.findAll();
    res.send({
      status: true,
      data: sources
    })
  } catch(e) {
    res.send({
      status: false,
      error: e
    })
  }
})

router.post("/addNewExternalLinks", async(req, res) => {
    const {
        externalLinks,
    } = req.body;
    if(externalLinks == null || externalLinks.length == 0) {
        return res.status(500).send({
            status: false,
            error: "Invalid Params"
        });
    }

    for(let linkObj of externalLinks) {
        try {
            await models.ExternalLink.create(linkObj, {logging: console.log});
        } catch(e) {
            console.log("unable to add link ");
            continue;
        }
    }
    res.send({
        status: true
    })
});

router.post("/createNewProducts", async(req, res) => {
  let notifications = [];
  let productList = req.body.productList;
  for(let i = 0; i < productList.length; i++) {
    try {
      let newProduct = await models.Product.create(productList[i]);
      notifications.push(newProduct);
    }catch(e) {
      console.log(productList[i]);
      console.log(e);
      continue;
    }
  }
  res.send({
    status: true,
    data: notifications
  })
})


router.post("/changeProductPrice", async(req, res) => {
    let list = req.body.list;
    for(let product of list) {
        try {
            await models.Product.update({
                currentPrice: product.currentPrice,
                oldPrice: product.oldPrice,
                discountDes: product.discountDes,
                stockInfo: product.stockInfo
            }, {
                where: {pid: product.pid},
                logging: console.log

            });
            console.log("price updated successfullly");
        } catch(e) {
            console.log(e)
            console.log("-------Unable to update price ----- ")
            continue
        }
    }
})

router.post("/updateProducts", async(req, res) => {

  let result = {}
  let productList = req.body.productList;
  for(let i = 0; i < productList.length; i++) {
    const curr = productList[i];
    let res = null;
    const updateInfo = {
      productInfoUrl: curr.productInfoUrl,
      currentPrice: curr.currentPrice,
      oldPrice: curr.oldPrice,
      discountPrice: curr.discountPrice,
      discountDes: curr.discountDes,
      stockInfo: curr.stockInfo,
      notificationType: curr.notificationType,
      active: 1
    }
    try {
      if(curr.pid != null && curr.pid > 0) {
        res = await models.Product.update(updateInfo, {
          where: {pid: curr.pid},
          logging: console.log
        });
        result[curr.productInfoUrl] = curr.pid;
      } else {
        res = await models.Product.update(updateInfo, {
          where: {productInfoUrl: curr.productInfoUrl},
          logging: console.log
        });
        let searchedId = await models.Product.find({where: {productInfoUrl: curr.productInfoUrl}, raw:true});
          if(searchedId != null) {
            result[curr.productInfoUrl] = searchedId.pid;
          }
      }


    }catch(e) {
      console.log("-------UNABLE TO UPDATE PRODUCT: " + curr.productInfoUrl + "----------");
      console.log(e);
      continue;
    }
  }

    res.send({
      status: true,
      data: result
    })
})

router.post("/sendNotifications", async(req, res) => {
  let notifications = req.body.notification;
  let productList = req.body.productList;
  let isTest = req.body.test;
  let type = req.body.type;
  // for(let i = 0; i < notifications.length; i++) {
  //   try {
  //     if(notifications[i].pid == null) {
  //       if(notifications[i].productInfoUrl != null) {
  //         let findId = await models.Product.find({where: {productInfoUrl: notifications[i].productInfoUrl}, raw: true});
  //         console.log("adding pid: " + findId.pid);
  //         notifications[i].pid = findId.pid;
  //       }
  //       if(notifications[i].pid  == null) {
  //         continue;
  //       }
  //     }
  //     await models.Notifications.upsert(notifications[i], {logging: console.log});
  //   } catch(e) {
  //       console.log("----------UnaABE TO CREATE NOTIFICATION----------");
  //       continue;
  //   }
  // }
    // sendEmail(notifications);


  let count = 0;
  try {
    let proHtml = ``;
    for (let i = 0; i < productList.length; i++) {
      const curr = productList[i];
      if(curr.currentPrice == -1) {
        // skip notification when it is out of stock
        continue;
      }
      count++;
      let notification = "New Item Created";
      notification = checkType(curr.notificationType);
      if(type != null && type == "newItem") {
        proHtml +=  `<div style="margin-bottom: 15px">
          <span>Product: ${curr.productTitle} </span><br/>
          <span>New Price: ${curr.currentPrice} </span> <br />
          type:<span style = "color: limegreen"> New Product </span><br/>
          <span>discount des: ${curr.discountDes} </span> <br/>
          <span>Stock Info: ${curr.stockInfo == null ? "Unknown" : curr.stockInfo} </span><br/>
          <span>Link: <a href = ${curr.productInfoUrl} > Click HERE </a></span> <br/>
        </div>`
      } else {
        proHtml +=  `<div style="margin-bottom: 15px">
          <span>Product: ${curr.productTitle} </span><br/>
          <span>New Price: ${curr.currentPrice} </span> <br />
          <span>Old Price: ${curr.oldPrice} </span><br/>
          <span>Stock Info: ${curr.stockInfo == null ? "Unknown" : curr.stockInfo} </span><br/>
          <span>Link: <a href = ${curr.productInfoUrl} > Click HERE </a></span> <br/>
        </div>`
      }
    }
    if(count == 0) {
      console.log("no notification to send");
        return res.send({
          status: true
        });
    }
    let htmlP = `
     <div>
        ${proHtml}
    </div>
    <br><p>Thank you!!!</p><p>Best,</p><p>Speeder Solutions Price Monitor</p>`;
    let emailList
    if(isTest === false) {
        emailList = ["lixx4793@umn.edu", "watercore@gmail.com", "zanlu1621@gmail.com"];
    } else {
        emailList = ["lixx4793@umn.edu"]
    }
    console.log("sending email ----*********************");
    for(let ei = 0; ei < emailList.length; ei++) {
      let mailOptions = {
        from: `priceMonitor3@speedersolutions.com`, // sender address
        to: emailList[ei], // list of receivers
        subject: `Price Monitor Notifications`, // Subject line
        text: '', // plain text body
        html: htmlP
      };
      //await transporter.sendMail(mailOptions);
    }

  // send mail with defined transport object

  } catch(e) {
    console.log("-----------UNABLE TO SEND EMAIL------");
    console.log(e);
  }
  res.send({
    status: true
  })
})

function checkType(notificationType) {
  let notification = "New Item Created";
  switch (notificationType) {
    case 1:
       notification = "探测到新的产品"
      break;
    case 2:
       notification = "探测到产品被下架"
      break;
    case 3:
      notification = "探测到价格升高"
      break;
    case 4:
       notification = "探测到价格减少"
      break;
    case 5:
       notification = "探测到库存更改"
      break;
    case 6:
       notification = "探测到新的优惠折扣"
      break;
    case 7:
       notification = "探测到折扣消失"
      break;
    case 8:
       notification = "探测到产品价格高于最高值"
      break;
    case 9:
       notification = "探测到产品价格低于最低价"
      break;
    case 12:
       notification = "探测到下架物品重新上架"
       break;
    case 13:
       notification = "探测到折扣变动"
      break;
    case 14:
       notification = "探测到商家有新的特殊提示"
       break;
    default:

  }
  return notification;
}
module.exports = router;
