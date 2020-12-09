# auth-server

A basic standalone auth server ready to go!
I mostly created this repo to be able to quickly reuse it in the future, but feel free to use it for your needs!

## Setup:

yarn install

You will need to add 3 secret keys to a .env file. I included an example.env, but make sure to rename it to .env and never commit it to your repo!!

1- ACCESS_TOKEN_SECRET

2- REFRESH_TOKEN_SECRET

These 2 are random strings that will be used for a base to sign your tokens.

They can be generated with node's crypto library, like so:

require("crypto").randomBytes(64).toString("hex")

You should run this line in a node terminal twice, to get 2 completely different random strings similar to this one:

47b24e8ad547d0b9533372a263cba477e00a6083b2b75fbcd513af8f1eed428ee585b5a16a3fc3883a4f7360a2f9b34424a3cce6d65fa6bd2181fb542e58c6a4

3- MONGO_URI

This is your MongoDB credentials, also should be secret.
Setting up your database is a whole other tutorial, but this is were we are retrieving your user credentials (username, password) for authentication, and keeping the refresh tokens safe.

## Your authentication server is index.js.

It contains 4 routes:

POST

/createUser

This route accepts the credentials from the front-end (name, password), only if an existing user wasn't already in the db with this username. It encrypts the password, generates an access token and a refresh token, and then calls the addUser function from the userDb.js helpers to add the user to the database if everything went well.

It returns both tokens back to the client.

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

## Server helper functions

The functions are in /helpers/serverHelpers.js

You should make sure your login function correctly plucks the identifier out of your database user on line 24. It could be anything you set up in your createUser function

Both tokenDb.js and userDb.js need to be configured with your mongodb database name and collection name, to retrieve your user for authentication, and to store your refresh tokens until the user logs out manually with the route /logout.

apiServer.js is purely added as an example, and contains the very important "authenticateToken" function.

This function should be located on your api server and should use the same ACCESS_TOKEN_SECRET as your auth server. This is critical, otherwise the signature on the tokens won't match!
