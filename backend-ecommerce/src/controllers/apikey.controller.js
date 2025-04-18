"use strict";

const ApiKeyService = require("../services/apikey.service");

class APIKeyController {
    async create(req, res) {
        const newAPIKey = await ApiKeyService.create();
        return res.status(201).json(newAPIKey);
    }
}

module.exports = new APIKeyController();