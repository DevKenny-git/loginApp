const mongoose = require("mongoose");
require("dotenv").config();

const connect = mongoose.connect(process.env.mongodbUrl)

connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch((err) => {
    console.log("Error Connecting to Database", err);
});


module.exports = connect;