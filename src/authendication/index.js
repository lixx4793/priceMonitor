const express = require("express");
const router = express.Router();
const models = require('../../models');
const md5 = require('md5');


router.post("/login", async(req, res) => {
    const { password } = req.body;
    console.log("the password is: " + password);
    console.log("expected password: " + md5("ssrc_price_monitor"))
    if(md5("ssrc_price_monitor") === password) {
      return res.send({
        status: true
      })
    }
    res.status(500).send({
      message: "wrong password",
      status: false
    })
})

module.exports = router;
