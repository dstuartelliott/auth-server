require("dotenv").config({ path: "../.env" });
const assert = require("assert");

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;
const { DATABASE_NAME, USERS_COLLECTION } = require("../constants");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addUser = async (user) => {
  try {
    const returningUser = await getUser(user.name);

    if (returningUser) {
      res.status(400).json({
        status: 400,
        message: "user already exists",
      });
      return;
    }

    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(DATABASE_NAME);

    const r = await db.collection(USERS_COLLECTION).insertOne(user);
    assert.strictEqual(1, r.insertedCount);

    client.close();

    return;
  } catch (err) {
    return res.status(500).send({ status: 500, message: err.message });
  }
};

const getUser = async (name) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(DATABASE_NAME);

    const user = await db.collection(USERS_COLLECTION).findOne({ name });
    client.close();

    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    console.log("in getUser", err);
  }
};

module.exports = { addUser, getUser };
