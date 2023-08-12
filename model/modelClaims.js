"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    reason: { type: String, required: true },
    message: { type: String, required: true }
});
const modelClaims = 'Claims';
const claimsModel = mongoose_1.connection && mongoose_1.connection.models[modelClaims]
    ? mongoose_1.connection.models[modelClaims]
    : (0, mongoose_1.model)(modelClaims, schema);
exports.default = claimsModel;
