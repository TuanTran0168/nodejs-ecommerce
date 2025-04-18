"use strict";

const apiKeyModel = require("../models/apikey.model");
const crypto = require("node:crypto");
const { getInfoData } = require("../utils");

class ApiKeyService {
    static findById = async (key) => {
        const objectKey = await apiKeyModel
            .findOne({ key, status: true })
            .lean();
        return objectKey;
    };

    static create = async () => {
        const objectKey = await apiKeyModel.create({
            key: crypto.randomBytes(16).toString("hex"),
            permissions: ["0000"],
        });
        return {
            code: "201",
            metadata: {
                key: getInfoData({
                    fields: ["key", "status", "permissions"],
                    object: objectKey,
                }),
            },
        };
    };
}

module.exports = ApiKeyService;
