//this file is an example that represent any other server that might have API requests, like getting posts

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const posts = [
  {
    username: "nick_angel",
    post: "Post 1",
  },
  {
    username: "danny_butterman",
    post: "Post 2",
  },
  {
    username: "andy_cartwright",
    post: "Post 2424",
  },
  {
    username: "andy_wainwright",
    post: "Post 134124142",
  },
];

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
  .get("/posts", authenticateToken, (req, res) => {
    console.log("from /posts", req.user.username);
    res.send(posts.filter((post) => post.username === req.user.username));
  })

  .use((req, res) => res.send("Not Found"))

  .listen(PORT, () => console.log(`Listening on port ${PORT}`));

//
//this function needs to be on the API server and needs the same ACCESS_TOKEN_SECRET as the authserver
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.status(401).send("not authorized");
  //console.log("token present");

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).send("invalid token");
    //console.log("from authenticateToken", user);
    req.user = user;
    next();
  });
}
