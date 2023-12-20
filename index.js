const express = require("express");
const port = 3000 || process.env.PORT;
require("dotenv").config();
const authRouter = require("../routes/auth.js");
const connect = require("./dbConnection.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");


const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cors());


app.use("/api/v1/auth", authRouter);


app.listen(port, () => {
    console.log("App listening on port", port);
})

