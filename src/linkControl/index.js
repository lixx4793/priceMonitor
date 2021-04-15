const express = require("express");
const router = express.Router();
const models = require('../../models');
const https = require('https');
const axios = require('axios');
const jsdom = require("jsdom");

const { JSDOM } = jsdom;

router.post("/checkUrl", async(req, res) => {
    const { funType, url } = req.body;
    if(!funType || !url || url.length < 3) {
        return res.send({
            status: false,
            err: "Invalid Params"
        })
    }
    let fetched = {
        title: "",
        currentPrice: "",
        stock: "",
        image: ""
    }

    try {
        let existingLink = await models.ExternalLink.findOne({
            where: {productInfoUrl: url},
            raw: true
        })
        if(existingLink) {
            return res.send({
                status: false,
                err: "This link is Already Existed"
            })
        }
    } catch(e) {
        console.log(e)
    }
    const headers = {
        "WM3": {
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36`
        },
        "AMAZEXT1": {
            "Authority": "www.amzon.com",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "keep-alive",
            "Host": "s.amazon-adsystem.com",
            "Referer": "https://www.google.com/",
            "Upgrade-Insecure-Requests": 1,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:77.0) Gecko/20100101 Firefox/77.0",
        },
        "BSBEXT1": {
          "authority": "www.bestbuy.com",
          "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "referer": "https://www.bestbuy.com",
          "upgrade-insecure-requests": 1,
        }
    }

    const tagLocations = {
         productTitle: ".sku-title h1",
         currentPrice: ".price-box .priceView-hero-price.priceView-customer-price span",
         oldPrice: ".pricing-price__regular-price",
         discountInfo: ".pricing-price__savings",
         stockInfo: ".fulfillment-add-to-cart-button button",
         imageSrc: ".primary-image"
    }

    if(headers[funType] == null) {
        return res.send({
            status: false,
            error: "UnSupported Funtion Type"
        })
    }
    let clientServerOptions = {
        url: url,
        method: 'GET',
        headers: headers[funType],
        timeout: 20000,
    }

    try {
        if(funType == "AMAZEXT1") {
            throw new Error("Amazon Validation Currently Not Supported, Add Link Directly");
        }
        let result = await axios(clientServerOptions);
        if(!result || result.status != 200) {
            throw new Error("Access Blocked by the Platform, Please Retry or try later");
        }

        // validation for walmart
        if(funType == "WM3") {
            let walData = result.data;
            if(!walData || !walData.items) {
                throw new Error("Bot Verification Triggered by Wlamart, Please Try Again");
            }
            if(walData.items.length == 0) {
                throw new Error("No Result Is Found, Please Try Other Walmart Id");
            }
            fetched.title = walData.items[0].title;
            fetched.stock = walData.items[0].quantity;
            fetched.image = walData.items[0].imageUrl;
            fetched.currentPrice = walData.items[0].primaryOffer.offerPrice;
        }
        if(funType == "BSBEXT1") {
            let pageData = result.data;
            const { document } = (new JSDOM(pageData)).window;
            try {
                fetched.title = document.querySelector(tagLocations.productTitle).innerHTML;
                fetched.stock = document.querySelector(tagLocations.stockInfo).innerHTML;
                if(fetched.stock.includes("Add to Cart")) {
                    fetched.stock = "In Stock"
                }
                fetched.image = document.querySelector(tagLocations.imageSrc).src;
                fetched.currentPrice =document.querySelector(tagLocations.currentPrice).innerHTML;
            } catch(e) {
                console.log(e)
                throw new Error("Unable to fetch content from this best buy page");
            }
        }
    } catch(e) {
        return res.send({status: false, err: e.message})
    }
    res.send({status: true, data: fetched})

})


router.post('/insertLink',  async(req, res) => {
    const {funType, url} = req.body;
    if(!funType || !url || url.length < 3) {
        return res.send({status: false, err: "Invalid Params"})
    }
    const supportedType = ["AMAZEXT1", "BSBEXT1", "WM3"];
    if(supportedType.indexOf(funType) < 0) {
        return res.send({status: false, err: "UnSupported Link Srouce"});
    }
    try {
        await models.ExternalLink.create({
            funType,
            productInfoUrl: url,
            manualAdded: 1
        })
    } catch(e) {
        return res.send({status: false, err: "Unable to Add Link Please Check Server Log, May Casued by Duplicate Link"});
    }
    res.send({status: true})
})

module.exports = router;
