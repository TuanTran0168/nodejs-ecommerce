"use strict";

const { json } = require("express");
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { AuthFailError, NotFoundError } = require("../../core/error.response");
const keyTokenService = require("../../services/keytoken.service");

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    AUTHORIZATION: "authorization",
};

const createTokenPair = async (payload, publicKey, privateKey) => {
    try {
        // access token (remove algorithm because 2 key now is String)
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: "RS256",
            expiresIn: "1 days",
        });

        // refresh token
        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: "RS256",
            expiresIn: "7 days",
        });

        JWT.verify(accessToken, publicKey, (err, decoded) => {
            if (err) {
                console.log(`Error verifying token: ${err}`);
            } else {
                console.log(`Token successfully decoded: ${decoded}`);
            }
        });

        return {
            accessToken,
            refreshToken,
        };
    } catch (error) {
        return error;
    }
};

const authentication = asyncHandler(async (req, res, next) => {
    /*
        1 - Check userId missing?
        2 - Get accessToken
        3 - verify token
        4 - Check user in database
        5 - Check KeyStore with this user
        6 - OKE All => return next()
     */

    // 1
    const userId = req.headers[HEADER.CLIENT_ID];
    console.log("AAAAA: ", HEADER.CLIENT_ID, req.headers)
    if (!userId) {
        throw new AuthFailError("Invalid Request (UserId is missing)")
    }

    // 2
    const keyStore = await keyTokenService.findByUserId(userId)
    if (!keyStore) {
        throw new NotFoundError("Not Found KeyStore (Key Token)")
    }

    // 3
    const accessToken = req.headers[HEADER.AUTHORIZATION]
    if (!accessToken) {
        throw new AuthFailError("Invalid Request (Access Token is missing)")
    }

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId != decodeUser.userId) {
            throw new AuthFailError("Invalid User (userId != UserDecoded)")
        }
        req.keyStore = keyStore;

        return next();
    } catch (error) {
        throw error;
    }

})

module.exports = {
    createTokenPair,
    authentication
};
