'use strict'

require('dotenv').config();

const devEnv = {
    app: {
        port: process.env.DEV_APP_PORT || 3000
    },
    database: {
        host: process.env.DEV_DATABASE_HOST || 'localhost',
        port: process.env.DEV_DATABASE_PORT || 27017,
        name: process.env.DEV_DATABASE_NAME || 'shopdev'
    }
}

const prodEnv = {
    app: {
        port: process.env.PROD_APP_PORT || 3000
    },
    database: {
        host: process.env.PROD_DATABASE_HOST || 'localhost',
        port: process.env.PROD_DATABASE_PORT || 27017,
        name: process.env.PROD_DATABASE_NAME || 'shopdev'
    }
}

const configuration = {
    development: devEnv,
    production: prodEnv
}
const env = process.env.NODE_ENV || 'development';
module.exports = configuration[env];
