require("dotenv").config({ path: "../.env" });
const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//make sure to correctly identify your database name and your token collection name
const databaseName = "";
const tokensCollectionName = "";

const addRefreshToken = async (token) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(databaseName);

    const r = await db.collection(tokensCollectionName).insertOne({ token });

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
    const db = client.db(databaseName);

    const dbToken = await db
      .collection(tokensCollectionName)
      .findOne({ token });
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
    const db = client.db(databaseName);

    const r = await db.collection(tokensCollectionName).deleteOne({ token });

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
