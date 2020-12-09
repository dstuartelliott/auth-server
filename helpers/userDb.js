require("dotenv").config({ path: "../.env" });

const databaseName = "";
const usersCollectionName = "";

const { MongoClient } = require("mongodb");
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getUser = async (username) => {
  try {
    const client = await MongoClient(MONGO_URI, options);

    await client.connect();
    const db = client.db(databaseName);

    const user = await db
      .collection(usersCollectionName)
      .findOne({ email: username });
    client.close();

    console.log(user.email);

    if (user) {
      return user;
    } else {
      return false;
    }
  } catch (err) {
    console.log("in getUser", err);
  }
};

module.exports = { getUser };
