const express = require("express");
const router = express.Router();
const models = require('../../models');

router.get("/", (req, res) => {
    res.send({
        message: 'welcome to item control api'
    })
})

router.post("/fetchProduct", async(req, res) => {
    const {
        productId,
    } = req.body;
    let result = {}
    if(!productId) {
        return res.status(500).send({
            message: "invalid params"
        });
    }
    try {
        result = await models.Product.findOne({
            where: {pid: productId},
            logging: console.log
        })
    } catch(e) {
        return res.status(500).send({
            message: "invalid params"
        });
    }
    res.send({
        data: result
    })
})

router.post("/updateProduct", async(req, res) => {
    const {
        pid, targetPrice, active, automaticOrder, accountOption
    } = req.body;
    if(pid == null || active == null) {
        return res.status(500).send({
            message: "Invalid Params"
        })
    }
    try {
        let updateItem = {
            active: active,
            automaticOrder,
            accountOption
        }
        if(targetPrice != null && targetPrice > 0) {
            updateItem.targetPrice = targetPrice
        }
        await models.Product.update(updateItem, {
            where: {pid: pid},
            logging: console.log
        })
    } catch(e) {
        console.log(e);
        return res.status(500).send({
            message: "Unable to update product "
        })
    }
    res.send({
        message: "update successful"
    })
})


module.exports = router;
