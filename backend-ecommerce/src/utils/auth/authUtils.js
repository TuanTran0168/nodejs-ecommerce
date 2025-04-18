"use strict";

const { json } = require("express");
const JWT = require("jsonwebtoken");

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

module.exports = {
    createTokenPair,
};
