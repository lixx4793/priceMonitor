const express = require('express');
const cors = require('cors');
const config = require('dotenv').config({path: __dirname + "/.env"});
const port = config.parsed.PORT || 8080;
var bodyParser = require('body-parser')
const app = express();
const scripHandlerRouter = require("./src/scripHandler");


app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use("/api", scripHandlerRouter);
app.get("/", (req, res) => {
    res.status(200).send({
      welcomeMessage: "Welcome to this api",
      Author: "Yuhao Li"
    })
});

app.listen(port, () => {
  console.log("server is listening at " + port);
})
