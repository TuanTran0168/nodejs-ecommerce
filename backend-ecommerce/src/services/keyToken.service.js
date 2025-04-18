"use strict";
const KeyTokenModel = require("../models/keytoken.model");

class keyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            const tokens = await KeyTokenModel.create({
                user: userId,
                publicKey,
                privateKey,
            });

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            return error;
        }
    };
}

module.exports = keyTokenService;
