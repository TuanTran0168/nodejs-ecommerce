"use strict";

const shopModel = require("../models/shop.model");
const bCrypt = require("bcrypt");
const crypto = require("crypto");
const keyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../utils/auth/authUtils");
const { getInfoData } = require("../utils");

const ROLE_SHOP = {
    ADMIN: "ADMIN",
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
};

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            const existingShop = await shopModel.findOne({ email }).lean();
            if (existingShop) {
                return {
                    code: "xxxxx",
                    message: "Email already exists",
                    status: "error",
                };
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
                const { privateKey, publicKey } = crypto.generateKeyPairSync(
                    "rsa",
                    {
                        modulusLength: 4069,
                        publicKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                        privateKeyEncoding: {
                            type: "pkcs1",
                            format: "pem",
                        },
                    }
                );

                console.log(
                    "Private key: ",
                    privateKey,
                    "\nPublic key: ",
                    publicKey
                );

                // Save public key to database (KeyToken model)
                const publicKeyString = await keyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey: publicKey,
                });

                console.log("Public key String: ", publicKeyString);

                if (!publicKeyString) {
                    return {
                        code: "xxxxx",
                        message: "Public key create failed",
                        status: "error",
                    };
                }

                const publicKeyObject = crypto.createPublicKey(publicKeyString);

                // create token pair (access token, refresh token)
                const tokens = await createTokenPair(
                    { userId: newShop._id, email: newShop.email },
                    publicKeyObject,
                    privateKey
                );
                console.log("Tokens: ", tokens);

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
        } catch (error) {
            return {
                code: "xxxxx",
                message: error.message,
                status: "error",
            };
        }
    };
}

module.exports = AccessService;
