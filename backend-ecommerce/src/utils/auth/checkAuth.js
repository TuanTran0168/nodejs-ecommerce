"use strict";

const ApiKeyService = require("../../services/apikey.service");

const HEADER = {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
};

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        if (!key) {
            return res.status(403).json({
                message: "API key is missing",
            });
        }

        const objectKey = await ApiKeyService.findById(key);
        if (!objectKey) {
            return res.status(403).json({
                message: "API key is invalid",
            });
        }
        console.log("API Key: ", objectKey.key, "Permissions: ", objectKey.permissions);
        req.objectKey = objectKey;
        return next();
    } catch (error) {
        console.error(error);
    }
};

const permissions = (permissions) => {
    return async (req, res, next) => {
        try {
            if (!req.objectKey || !req.objectKey.permissions) {
                return res.status(403).json({
                    message: "Permission is missing",
                });
            }

            const validPermissions = req.objectKey.permissions.includes(permissions);

            if (!validPermissions) {
                return res.status(403).json({
                    message: "Permission is invalid",
                });
            }

            return next();
        } catch (error) {
            console.error(error);
            return next(error);
        }
    };
};

module.exports = {
    apiKey,
    permissions,
};
