const express = require("express");
const router = express.Router();
const models = require('../../models');

router.post("/fetchProduct", async(req, res) => {
  const { condition } = req.body;
  if(condition == null || condition.page == null || !condition.pageSize) {
    return res.status(500).send({
      message: "wrong params"
    })
  }
  let search = {};
  const offSet = (condition.page) * condition.pageSize;
  if(condition.sid != null) {
    search.sid = condition.sid
  }
  let countFilter = {};
  if(condition.filter != null && condition.filter.length > 0) {
    search.productTitle =  {$like: `%${condition.filter.trim()}%`};
    countFilter.productTitle =  {$like: `%${condition.filter.trim()}%`};
  }
  let result = [];
  let total = 0;

  try {
    total = await models.Product.count({
      where: {...countFilter}
    });
    result = await models.Product.findAll({
      where: {...search},
      limit: condition.pageSize,
      offset: offSet,
      raw: true,
      logging: console.log,
      order: [["updatedAt", "DESC"]]
    })
  } catch(e) {
    console.log(e)
    console.log("unable to fetch product with condition");
    return res.status(500).send({
      message: e
    })
  }
  res.send({
    status: true,
    data: result,
    totalCount: total
  })

})

router.post("/changeTargetPrice", async(req, res) => {
  const { targetPrice, pid } = req.body;
  if(!targetPrice || !typeof targetPrice === "number" || !pid || targetPrice < 0) {
    return res.status(500).send({
      message: "wrong params"
    })
  }
  let transaction = await models.sequelize.transaction();
  try {
    await models.Product.update({
      targetPrice: targetPrice
    }, {
      where: {pid: pid},
      logging: console.log,
      transaction: transaction
    });
  } catch(e) {
    await transaction.rollback();
    return res.status(500).send({
      message: "unable to update target price"
    })
  }
  await transaction.commit();
  res.send({
    status: true,
  })

})



module.exports = router;
