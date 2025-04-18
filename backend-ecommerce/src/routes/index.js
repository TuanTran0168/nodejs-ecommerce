'use strict'

const express = require('express');
const { apiKey, permissions } = require('../utils/auth/checkAuth');
const router = express.Router();

router.use("/api/v1", require("./apikey/index"))

// check API KEY
router.use(apiKey);

// check permission
router.use(permissions("0000"));

router.use("/api/v1", require("./access/index"))

module.exports = router;
