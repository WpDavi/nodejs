"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listPost = exports.uplodPost = exports.loginUser = exports.createUser = exports.listUser = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const modelUsers_1 = __importDefault(require("../model/modelUsers"));
const sharp_1 = __importDefault(require("sharp"));
const modelPost_1 = __importDefault(require("../model/modelPost"));
const promises_1 = __importDefault(require("fs/promises"));
const { format } = require("date-fns");
dotenv_1.default.config();
const listUser = async (req, res) => {
    const userList = await modelPost_1.default.findAll();
    res.json({ list: userList });
};
exports.listUser = listUser;
const createUser = async (req, res) => {
    const { name, number, email, password, fone, blood, token, photoperfil } = req.body;
    console.log(req.body);
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório" });
    }
    else if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" });
    }
    else if (!password) {
        return res.status(422).json({ msg: "O password é obrigatório" });
    }
    else if (!fone) {
        return res.status(422).json({ msg: "O fone é obrigatório" });
    }
    else if (!blood) {
        return res.status(422).json({ msg: "O blood é obrigatório" });
    }
    const userExists = await modelUsers_1.default.findOne({ where: { email } });
    if (userExists)
        return res.status(422).json({ msg: "E-mail já cadastrado" });
    try {
        const newUser = await modelUsers_1.default.create({
            id: 0,
            name,
            number,
            email,
            password,
            fone,
            blood,
            token,
            photoperfil,
        });
        res
            .status(201)
            .json({ id: newUser.id, name: newUser.name, msg: "Cadastrado" });
    }
    catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createUser = createUser;
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    if (!email)
        return res.status(202).json({ msg: "email obrigatorio!" });
    if (!password)
        return res.status(202).json({ msg: "Password obrigatorio" });
    const user = await modelUsers_1.default.findOne({ where: { email } });
    if (!user)
        return res.status(422).json({ msg: "usuario nao encontrado" });
    if (user.password !== password)
        return res.status(422).json({ msg: "Senha incorreta" });
    res.status(200).json({ msg: "Login", token: `${user.email}` });
};
exports.loginUser = loginUser;
const uplodPost = async (req, res) => {
    console.log(req.headers.email);
    const name = String(req.headers.name);
    const email = String(req.headers.email);
    const status = String(req.headers.status);
    const dataAtual = new Date();
    const data = format(dataAtual, "yyyy/dd/MM/");
    if (req.file) {
        try {
            await promises_1.default.mkdir(`./public/${req.headers.email}/post`, { recursive: true });
        }
        catch (error) {
            console.error("Erro ao criar pasta:", error);
            res.status(500).json({ msg: "Erro ao criar pasta do usuário" });
            return;
        }
        try {
            await (0, sharp_1.default)(req.file.path)
                .resize(500)
                .toFormat("jpeg")
                .toFile(`./public/${req.headers.email}/post/midia_${req.file.filename}.jpg`);
            await promises_1.default.unlink(req.file.path);
            try {
                const newUser = await modelPost_1.default.create({
                    id: 0,
                    email,
                    name,
                    photo: `${req.headers.email}/post/midia_${req.file.filename}.jpg`,
                    status,
                    data,
                });
                res
                    .status(201)
                    .json({ id: newUser.id, name: newUser.name, msg: "Cadastrado" });
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ error: "Internal server error" });
            }
        }
        catch (error) {
            console.error("Erro ao processar imagem:", error);
            res.status(500).json({ msg: "Erro ao processar a imagem" });
        }
    }
    else {
        res.json({ msg: "Arquivo inválido" });
    }
};
exports.uplodPost = uplodPost;
const listPost = async (req, res) => {
    if (modelPost_1.default.sequelize) {
        try {
            const userList = await modelPost_1.default.sequelize.query(`SELECT p.*, u.photoperfil, u.number
        FROM posts p
        JOIN Users u ON p.email = u.email;`);
            res.json(userList);
        }
        catch (error) {
            console.error("Error querying the database:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
    else {
        res.status(500).json({ error: "Database connection not available" });
    }
};
exports.listPost = listPost;
