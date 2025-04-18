"use strict";

const express = require("express");
const apikeyController = require("../../controllers/apikey.controller");
const router = express.Router();

router.post("/apikey/create", apikeyController.create);

module.exports = router;
