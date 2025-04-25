"use strict";

const shopModel = require("../models/shop.model");
const bCrypt = require("bcrypt");
const crypto = require("node:crypto");
const keyTokenService = require("./keytoken.service");
const { createTokenPair } = require("../utils/auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestError, AuthFailError } = require("../core/error.response");
const ShopService = require("./shop.serivce");

const ROLE_SHOP = {
    ADMIN: "ADMIN",
    SHOP: "SHOP",
    WRITER: "WRITER",
    EDITOR: "EDITOR",
};

class AccessService {

    /*
        1 - check email in database
        2 - match password
        3 - create access token & refresh token => save
        4 - generate tokens
        5 - get data return login
    */

    static login = async ({email, password, refreshToken = null}) => {
        // 1 - check email in database
        const existingShop = await ShopService.findByEmail({email});
        if (!existingShop) throw new BadRequestError("Shop not Found!");

        // 2 - match password
        const isMatch = bCrypt.compare(password, existingShop.password);
        if (!isMatch) throw new AuthFailError("Authentication Error!")
        
        // 3 - create access token & refresh token => save
        const publicKey = crypto.randomBytes(64).toString("hex")
        const privateKey = crypto.randomBytes(64).toString("hex")
        const tokens = await createTokenPair({
            userId: existingShop._id,
            email: existingShop.email
        }, publicKey, privateKey)


        await keyTokenService.createKeyToken({
            userId: existingShop._id,
            refreshToken: tokens.refreshToken,
            publicKey: publicKey,
            privateKey: privateKey,
        })

        

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: existingShop,
            }),
            tokens,
        };
    }

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

            // create token pair (access token, refresh token)
            const tokens = await createTokenPair(
                { userId: newShop._id, email: newShop.email },
                publicKey,
                privateKey
            );
            console.log("Tokens: ", tokens);

            // Save public key to database (KeyToken model)
            const keyStore = await keyTokenService.createKeyToken({
                userId: newShop._id,
                refreshToken: tokens.refreshToken,
                publicKey: publicKey,
                privateKey: privateKey,
            });

            console.log("keyStore: ", keyStore);

            if (!keyStore) {
                throw new BadRequestError("keyStore create failed!");
            }

            if (!tokens) {
                return {
                    code: "xxxxx",
                    message: "Tokens create failed",
                    status: "error",
                };
            }

            return {
                shop: getInfoData({
                    fields: ["_id", "name", "email"],
                    object: newShop,
                }),
                tokens,
            };
        }

        return {
            code: "200",
            metadata: null,
        };
    };
}

module.exports = AccessService;
