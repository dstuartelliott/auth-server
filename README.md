# auth-server

A basic standalone auth server ready to go!
I mostly created this repo to be able to quickly reuse it in the future, but feel free to use it for your needs!

Setup:

yarn install

You will need to add 3 secret keys to a .env file. I included an example.env, but make sure to rename it to .env and never commit it to your repo!!

1- ACCESS_TOKEN_SECRET
2- REFRESH_TOKEN_SECRET

These 2 are random strings that will be used for a base to sign your tokens.

They can be generated with node's crypto library, like so:
require("crypto").randomBytes(64).toString("hex")

You should run this line in a node terminal twice, to get 2 completely different random strings.

3- MONGO_URI
This is your MongoDB credentials, also should be secret.
Setting up your database is a whole other tutorial, but this is were we are retrieving your user credentials (username, password) for authentication, and keeping the refresh tokens safe.

Your authentication server is index.js.
It contains 3 routes:

POST
/login

This route validates the client's username and password, and if it matches, it creates a token, a refreshToken, which is added to the database
Then, it sends both tokens back to the client.

POST
/token

This route is used when the client's token is expired. The client should use the refreshToken with this route to recieve a new access token that will be valid for the duration that suits your needs.

DELETE
/logout
This route is used when the user wants to log out on their client. This uses their refresh tokens and deletes it from the database, ensuring that no new access tokens can be created from this refreshToken. They will have to login again to receive a new pair of token and refreshToken.

The functions are in /helpers/serverHelpers.js
You should make sure your login function correctly plucks the identifier out of your database user on line 24. In my case it was user.email, but it could be anything.

Both tokenDb.js and userDb.js need to be configured with your mongodb database name and collection name, to retrieve your user for authentication, and to store your refresh tokens until the user logs out manually with the route /logout.

apiServer.js is purely added as an example, and contains the very important "authenticateToken" function. This function should be located on your api server and should use the same ACCESS_TOKEN_SECRET as your auth server. This is critical, otherwise the signature on the tokens won't match!
