'use strict'

const shopModel = require('../models/shop.model');
const bCrypt = require('bcrypt');
const crypto = require('crypto');

const ROLE_SHOP = {
    ADMIN: 'ADMIN',
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {

            const existingShop = await shopModel.findOne({email}).lean();
            if (existingShop) {
                return {
                    code: 'xxxxx',
                    message: 'Email already exists',
                    status: 'error',
                }
            }

            const passwordHash = await bCrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name: name, 
                email: email, 
                password: passwordHash, 
                roles: [ROLE_SHOP.SHOP]
            });

            if (newShop) {
                // create private key, public key
                const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 4069,
                })

                console.log("Private key: ", privateKey, "\nPublic key: ", publicKey);
            }

            return {
                code: 'xxxxx',
                message: 'Sign up successfully',
                status: 'success',
                metadata: {userId: newShop._id},
            }
            
        } catch (error) {
            return {
                code: 'xxxxx',
                message: error.message,
                status: 'error',
            }
        }
    }
}

module.exports = AccessService;