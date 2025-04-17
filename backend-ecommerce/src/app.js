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

// Init database
require("./databases/init.mongodb");
checkOverload();

// Init routes
app.get("/", (req, res, next) => {
  const stringCompression = " ALO ALO ALO ";
  return res.status(200).json({
    message: "Hello World, I'm Tuấn Trần",
    metadata: stringCompression.repeat(1000000),
  });
});

// handle errors

module.exports = app;
