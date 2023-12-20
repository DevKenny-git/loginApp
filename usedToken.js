const jwt = require("jsonwebtoken");
require("dotenv").config();


const createToken = (user) => {
    const tokenExpiration = "1d";

    const accessToken = jwt.sign(
        {username: user.username, id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, password: user.password},
        process.env.secret,
        {expiresIn: tokenExpiration}
    );
    return accessToken;
}



module.exports = { createToken}