require("dotenv").config({ path: "../.env" });
const assert = require("assert");
const bcrypt = require("bcrypt");

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//make sure to correctly identify your database name and your users collection name
const databaseName = "space_trade";
const usersCollectionName = "test_users";

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
    const db = client.db(databaseName);

    const r = await db.collection(usersCollectionName).insertOne(user);
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
    const db = client.db(databaseName);

    const user = await db.collection(usersCollectionName).findOne({ name });
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
