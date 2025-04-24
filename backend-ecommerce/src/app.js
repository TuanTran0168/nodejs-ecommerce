const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const { checkOverload } = require("./helpers/check.connect");
require("dotenv").config();
const app = express();

// Init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ 
    extended: true 
}));

// Init database
require("./databases/init.mongodb");
checkOverload();

// Init routes
app.use("/", require("./routes"));

// handle errors
app.use((req, res, next) => {
    console.log("handle errors A")
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    console.log("handle errors B")
    const statusCode = error.status || 500
    
    return res.status(statusCode).json({
        status: "error",
        code: statusCode,
        message: error.message || "INTERNAL SERVER ERROR"
    })
})

module.exports = app;
