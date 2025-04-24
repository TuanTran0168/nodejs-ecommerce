'use strict'

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandleError } = require("../../middlewares/handler.error.middleware");
const router = express.Router();

// Sign up
router.post("/shop/signup", asyncHandleError(accessController.signUp) );

module.exports = router;