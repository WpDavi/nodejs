"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConnect = void 0;
const mongoose_1 = require("mongoose");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoConnect = async () => {
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASS;
    try {
        console.log('connectando ao banco de dados');
        await (0, mongoose_1.connect)(process.env.MONGO_URL);
        console.log('MongoDB connectado');
    }
    catch (error) {
        console.log('Erro Conexão MongoDB,', Error);
    }
};
exports.mongoConnect = mongoConnect;
