"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const sequelize_1 = require("./database/sequelize");
const RouterAuthentication_1 = __importDefault(require("./router/RouterAuthentication"));
// conecção com mongo
//import { mongoConnect } from './database/mongo'
//mongoConnect()
const server = (0, express_1.default)();
dotenv_1.default.config();
server.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
server.use(express_1.default.json());
server.use(RouterAuthentication_1.default);
server.use((req, res) => {
    res.status(404).json({ msg: "Pagina não encontrada" });
});
server.listen(process.env.PORT || 3333, async () => {
    console.log(`- RODANDO NO ENDEREÇO: ${process.env.PORT || 3333}`);
    try {
        await sequelize_1.sequelize.authenticate();
        console.log("conectado com o banco de dados");
    }
    catch (error) {
        console.log("Deu problema", error);
    }
});
