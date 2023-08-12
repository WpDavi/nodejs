"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});
const modelName = "User";
const userModel = mongoose_1.connection && mongoose_1.connection.models[modelName]
    ? mongoose_1.connection.models[modelName]
    : (0, mongoose_1.model)(modelName, schema);
//exportando o model caso ele exista e caso não exista cria ele
exports.default = userModel;
