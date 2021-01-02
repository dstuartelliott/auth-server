require("dotenv").config({ path: "../.env" });
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const { DATABASE_NAME, TOKENS_COLLECTION } = require("../constants");

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const addRefreshToken = async (token) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(DATABASE_NAME);

    const r = await db.collection(TOKENS_COLLECTION).insertOne({ token });

    if (r) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("addRefreshToken", err);
  }

  client.close();
};

const checkRefreshToken = async (token) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(DATABASE_NAME);

    const dbToken = await db.collection(TOKENS_COLLECTION).findOne({ token });
    client.close();
    if (dbToken) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("checkRefreshToken", err);
  }
};

const deleteRefreshToken = async (token) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(DATABASE_NAME);

    const r = await db.collection(TOKENS_COLLECTION).deleteOne({ token });

    console.log("delete token", r.deletedCount);

    client.close();

    if (r.deletedCount === 1) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("deleteRefreshToken", err);
  }
};

module.exports = { addRefreshToken, checkRefreshToken, deleteRefreshToken };
