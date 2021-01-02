require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { addUser, getUser } = require("./userDb");
const {
  addRefreshToken,
  checkRefreshToken,
  deleteRefreshToken,
} = require("./tokenDb");

const { TOKEN_DURATION } = require("../constants");

const createUser = async (req, res) => {
  //this route should be hit with a name and password coming from the front-end
  const { name, password } = req.body;
  try {
    const returningUser = await getUser(name);

    if (returningUser) {
      res.status(400).json({
        status: 400,
        message: "user already exists",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, password: hashedPassword };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

    addRefreshToken(refreshToken);
    addUser(user);

    res.status(201).send({
      status: 201,
      accessToken,
      refreshToken,
    });

    return;
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const login = async (req, res) => {
  const dbUser = await getUser(req.body.name);

  if (!dbUser) {
    return res.status(400).send("Cannot Find User");
  }

  try {
    if (await bcrypt.compare(req.body.password, dbUser.password)) {
      // they provided the same password -- they are logged in
      //IMPORTANT
      //pluck the identifying element from that database user to create the token
      const username = dbUser.name;
      const user = { username };
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);

      addRefreshToken(refreshToken);

      return res.status(200).send({
        status: 201,
        accessToken,
        refreshToken,
      });
    } else {
      res.status(403).send("Passwords dont match");
    }
  } catch (err) {
    console.log("error!!", err);
    return res.status(500).send(err);
  }
};

const deleteToken = async (req, res) => {
  try {
    const response = await deleteRefreshToken(req.body.token);
    console.log(response);

    if (response) {
      console.log("logout worked");
      return res.sendStatus(204);
    } else {
      return res.status(400).send({ status: 400, message: "token not found" });
    }
  } catch (err) {
    console.log("error in logout", err);
    return res.status(500).send(err);
  }
};

const generateAccessToken = (user) => {
  //console.log("generating access token");
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: TOKEN_DURATION,
  });
};

const refreshToken = async (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if ((await checkRefreshToken(refreshToken)) === false)
    return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403);
    //console.log("from refreshToken", user);
    const accessToken = generateAccessToken({ username: user.username });
    res.status(201).json({ accessToken });
  });
};

module.exports = {
  createUser,
  login,
  refreshToken,
  deleteToken,
  generateAccessToken,
};
