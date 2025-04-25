'use strict'

const express = require("express");
const accessController = require("../../controllers/access.controller");
const { asyncHandleError } = require("../../middlewares/handler.error.middleware");
const { authentication } = require("../../utils/auth/authUtils");
const router = express.Router();

// Sign up
router.post("/shop/signup", asyncHandleError(accessController.signUp) );
// Login
router.post("/shop/login", asyncHandleError(accessController.login) );

// Authentication
router.use(authentication)

router.post("/shop/logout", asyncHandleError(accessController.logout) );


module.exports = router;