const express = require("express");
const router = express.Router();
const models = require('../../models');
const util = require("../util/generalFunction");

router.get("/fetchAccount", async(req, res) => {
  let data = [];
  try {
    const accounts = await models.Account.findAll({
      raw: true
    });

    for(let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      let item = {...account}
      // find all record for this account
      const records = await models.Record.findAll({
        include: [
          {
            model: models.Product,
            as: "product",
            foreignKey: "pid",
            required: true,
            attributes: ["productTitle", "pid", "productInfoUrl"]
          },
          {
            model: models.Acmap,
            as: "acmap",
            foreignKey: "acmapId",
            required: true,
            where: {accountId: account.accountId},
          }
        ],
        raw: true
      });
      item.records = records;
      // find all cards belong to this account
      const cards = await models.Acmap.findAll({
        include: [
          {
            model: models.Card,
            as: "card",
            foreignKey: "cardId",
            required: true
          }
        ],
        where: {accountId: account.accountId},
        raw: true
      });
      item.cards = [];
      cards.forEach((card, i) => {
        item.cards.push({
          ...card,
          'card.cardFirstName': util.encrypt(card['card.cardFirstName']),
          'card.cardNumber': util.encrypt(card['card.cardNumber']),
          'card.cvv': util.encrypt(card['card.cvv']),
          'card.cardLastName': util.encrypt(card['card.cardLastName']),
        })
      });

      data.push(item);
    }

  } catch(e) {
    return res.status(500).send({
      message: "unable to fetch accounts"
    })
  }

  res.send({
    data: data
  })

})

router.post('/upsertAccount', async(req, res) => {
  if(req.body.data == null || req.body.data.owner == null) {
    return res.status(500).send({
      status: false,
      message: "Invalid Params"
    })
  }
  const { data } = req.body;
  let accountId = data.accountId;
  let transaction = await models.sequelize.transaction();
  if(!accountId && accountId != 0) {
  // add to new account
    try {
      let newAccount = await models.Account.create({
        email: data.email,
        owner: data.owner,
        active: data.active,
        note: data.note
      }, {transaction: transaction});
      accountId = newAccount.accountId;
    } catch(e) {
      await transaction.rollback();
      return res.status(500).send({
        status: false,
        message: e.errors && e.errors.length > 0 ? "unable to create new account - " + e.errors[0].message : "unable to create new account"
      })
    }
  } else {
    // update account
    try {
      await models.Account.update({
        email: data.email,
        owner: data.owner,
        active: data.active,
        note: data.note
      }, {where: {accountId: accountId}, transaction: transaction});
    } catch(e) {
      await transaction.rollback();
      return res.status(500).send({
        status: false,
        message: e.errors && e.errors.length > 0 ? "unable to update account - " + e.errors[0].message : "unable to update account"
      })
    }
  }

  // update cards information
  let cardIdArray = [-1];
  for(let i = 0; i < data.cards.length; i++) {
    const curr = data.cards[i];
    if(!curr || !curr['card.cvv'] || !curr['card.cvv']['iv']) {
      return res.status(500).send({
        status: false,
        message: "Inavlid Card Params"
      })
    }
    try {
      // update existing card
      if(curr.cardId) {
        cardIdArray.push(curr.cardId);
        await models.Card.update({
          cardFirstName: util.decrypt(curr['card.cardFirstName']),
          cardNumber: util.decrypt(curr['card.cardNumber']),
          cvv: util.decrypt(curr['card.cvv']),
          cardLastName: util.decrypt(curr['card.cardLastName']),
          expireMonth: curr['card.expireMonth'],
          expireYear: curr["card.expireYear"]
        }, {where: {cardId: curr.cardId}, transaction: transaction});
      } else {
        // check if this card existed
        let check = await models.Card.findOne({
          where: {cardNumber: util.decrypt(curr['card.cardNumber'])},
          raw: true,
          logging: console.log
        })
        let newCardId = (!check || !check.cardId) ? null : check.cardId;
        // create card if not existed
        if(newCardId == null) {
          let newCard = await models.Card.create({
            cardFirstName: util.decrypt(curr['card.cardFirstName']),
            cardNumber: util.decrypt(curr['card.cardNumber']),
            cvv: util.decrypt(curr['card.cvv']),
            cardLastName: util.decrypt(curr['card.cardLastName']),
            expireMonth: curr['card.expireMonth'],
            expireYear: curr["card.expireYear"]
          }, {transaction: transaction});
          newCardId = newCard.cardId;
        }
        cardIdArray.push(newCardId);

        // add to acmap
        await models.Acmap.create({
          accountId: accountId,
          cardId: newCardId
        }, {transaction: transaction});
      }
    } catch(e) {
      console.log(e);
      await transaction.rollback();
      const number =  util.decrypt(curr['card.cardNumber']);
      let premessage = "unable to update card " + number + " - ";
      return res.status(500).send({
        status: false,
        message: e.errors && e.errors.length > 0 ? premessage + e.errors[0].message : premessage
      })
    }
  }
  // remove deleted card
  try {
    await models.Acmap.destroy({
      where: {
        accountId: accountId,
        cardId: { $notIn: cardIdArray }
      }
    }, {transaction: transaction, logging: console.log})
  } catch(e) {
    console.log("unable to delete acmap");
    console.log(e);
    await transaction.rollback();
    return res.status(500).send({
      status: false,
      message: "unable to delete card"
    })

  }


  await transaction.commit();
  res.send({
    status: true
  })
})



module.exports = router;
