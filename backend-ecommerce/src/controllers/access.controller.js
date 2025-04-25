"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponse({
            message: "Login Success!",
            metadata: await AccessService.login(req.body)
        }).send(res);
    }

    logout = async (req, res, next) => {
        // The `keyStore` variable is assigned in the function `authentication` in authUtils
        new SuccessResponse({
            message: "Logout Success!",
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    signUp = async (req, res, next) => {
        console.log(`P::signUp::`, req.body);

        // return res.status(201).json(await AccessService.signUp(req.body));

        new CREATED({
            message: "Registered OK",
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10,
            },
        }).send(res);
    };
}

module.exports = new AccessController();
