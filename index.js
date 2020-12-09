const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const { login, refreshToken, deleteToken } = require("./helpers/serverHelpers");

const PORT = process.env.PORT || 31420;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))

  // routes
  .post("/login", login)
  .post("/token", refreshToken)
  .delete("/logout", deleteToken)

  .use((req, res) => res.send("Not Found"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
