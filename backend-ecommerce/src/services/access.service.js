"use strict";

const shopModel = require("../models/shop.model");
const bCrypt = require("bcrypt");
const crypto = require("node:crypto");
const keyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../utils/auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError } = require("../core/error.response");

const ROLE_SHOP = {
    ADMIN: "ADMIN",
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        const existingShop = await shopModel.findOne({ email }).lean();
        if (existingShop) {
            throw new BadRequestError("Email already exists");
        }

        const passwordHash = await bCrypt.hash(password, 10);

        const newShop = await shopModel.create({
            name: name,
            email: email,
            password: passwordHash,
            roles: [ROLE_SHOP.SHOP],
        });

        if (newShop) {
            // create private key, public key
            // const { privateKey, publicKey } = crypto.generateKeyPairSync(
            //     "rsa",
            //     {
            //         modulusLength: 4069,
            //         publicKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //         privateKeyEncoding: {
            //             type: "pkcs1",
            //             format: "pem",
            //         },
            //     }
            // );

            const privateKey = crypto.randomBytes(64).toString("hex");
            const publicKey = crypto.randomBytes(64).toString("hex");

            // Save public key to database (KeyToken model)
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                publicKey: publicKey,
                privateKey: privateKey,
            });

            console.log("keyStore: ", keyStore);

            if (!keyStore) {
                throw new BadRequestError("keyStore create failed!");
            }

            // create token pair (access token, refresh token)
            const tokens = await createTokenPair(
                { userId: newShop._id, email: newShop.email },
                publicKey,
                privateKey
            );
            console.log("Tokens: ", tokens);

            if (!tokens) {
                return {
                    code: "xxxxx",
                    message: "Tokens create failed",
                    status: "error",
                };
            }

            return {
                code: "201",
                metadata: {
                    shop: getInfoData({
                        fields: ["_id", "name", "email"],
                        object: newShop,
                    }),
                    tokens,
                },
            };
        }

        return {
            code: "200",
            metadata: null,
        };
    };
}

module.exports = AccessService;
