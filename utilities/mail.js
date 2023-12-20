const sendMail = require("nodemailer");
require("dotenv").config();

const options = {
    service: "Gmail",
    auth: {
        user: process.env.email,
        pass: process.env.pass
    }
}

const send = sendMail.createTransport(options);

module.exports = {send};