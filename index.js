const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('dotenv').config({path: __dirname + "/.env"});
const port = config.parsed.PORT || 8080;
var bodyParser = require('body-parser')
const scripHandlerRouter = require("./src/scripHandler");
const scripManagerRouter = require("./src/scripManager");
const scripAuthendication = require("./src/authendication");
const accountManager = require("./src/accountManager");
const serveStatic = require('serve-static');
const app = express();

app.use(serveStatic(path.join(__dirname, './build'), {
  maxAge: '1d'
}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api", scripHandlerRouter);
app.use("/api/priceManager", scripManagerRouter);
app.use("/api/authendication", scripAuthendication);
app.use("/api/accountManager", accountManager);
app.get("/", (req, res) => {
    res.status(200).send({
      welcomeMessage: "Welcome to this api",
      Author: "Yuhao Li"
    })
});

app.listen(port, () => {
  console.log("server is listening at " + port);
})
