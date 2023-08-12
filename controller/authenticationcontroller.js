"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFille = exports.deletClaims = exports.changeClaims = exports.readOneClaims = exports.readClaims = exports.createClaims = exports.login = exports.createUser = void 0;
const promises_1 = require("fs/promises");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const modelUser_1 = __importDefault(require("../model/modelUser"));
const modelClaims_1 = __importDefault(require("../model/modelClaims"));
const dotenv_1 = __importDefault(require("dotenv"));
const sharp_1 = __importDefault(require("sharp"));
const modelUsers_1 = __importDefault(require("../model/modelUsers"));
dotenv_1.default.config();
const createUser = async (req, res) => {
    const { name, email, password, confirmpassword } = req.body;
    if (!name) {
        return res.status(422).json({ msg: "O nome é obrigatório" });
    }
    if (!email) {
        return res.status(422).json({ msg: "O email é obrigatório" });
    }
    if (!password) {
        return res.status(422).json({ msg: "A senha é obrigatório" });
    }
    if (password != confirmpassword) {
        return res.status(422).json({ msg: "As senhas nao conferem" });
    }
    const userExists = await modelUser_1.default.findOne({ email: email });
    if (userExists) {
        return res.status(422).json({ msg: "E-mail já cadastrado" });
    }
    const salt = await bcrypt_1.default.genSalt(12);
    const passwordHash = await bcrypt_1.default.hash(password, salt);
    const user = new modelUser_1.default({
        name,
        email,
        password: passwordHash,
    });
    try {
        await user.save();
        res.status(201).json({ msg: "Usuário criado com sucesso!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
};
exports.createUser = createUser;
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email) {
        return res.status(202).json({ msg: "email obrigatorio!" });
    }
    if (!password) {
        return res.status(202).json({ msg: "Password obrigatorio" });
    }
    const user = await modelUser_1.default.findOne({ email: email });
    if (!user) {
        return res.status(422).json({ msg: "usuario nao encontrado" });
    }
    const checkPassword = await bcrypt_1.default.compare(password, user.password);
    if (!checkPassword) {
        return res.status(201).json({ msg: "senha incorreta" });
    }
    try {
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
        }, process.env.SECRET);
        res.status(200).json({ msg: "deu certo", token });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
};
exports.login = login;
const createClaims = async (req, res) => {
    const { reason, message } = req.body;
    if (!reason) {
        return res.status(404).json({ msg: "O motivo e obrigatorio" });
    }
    if (!message) {
        return res.status(404).json({ msg: "A reclamação e obrigatoria" });
    }
    const claims = new modelClaims_1.default({
        reason,
        message,
    });
    try {
        let newClaims = await claims.save();
        res.status(201).json({ id: newClaims._id, reason, message });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ msg: error });
    }
};
exports.createClaims = createClaims;
const readClaims = async (req, res) => {
    let list = await modelUsers_1.default.findAll();
    res.json({ list });
};
exports.readClaims = readClaims;
const readOneClaims = async (req, res) => {
    let id = await req.params._id;
    let complaint = await modelClaims_1.default.findById(id);
    if (complaint) {
        res.json({ complaint });
    }
    else {
        res.json({ error: "frase nao encontrada" });
    }
};
exports.readOneClaims = readOneClaims;
const changeClaims = async (req, res) => {
    const id = await req.params._id;
    const { reason, message } = req.body;
    const claims = {
        reason,
        message,
    };
    if (reason || message) {
        const update = await modelClaims_1.default.updateOne({ _id: id }, claims);
        res.json({ msg: "Reclamação alterada" });
    }
    else {
        res.json({ msg: "Precisa do motivo ou a mensagem para alterar" });
    }
};
exports.changeClaims = changeClaims;
const deletClaims = async (req, res) => {
    const id = await req.params._id;
    await modelClaims_1.default.remove({ _id: id });
};
exports.deletClaims = deletClaims;
const uploadFille = async (req, res) => {
    if (req.file) {
        await (0, sharp_1.default)(req.file.path)
            .resize(500)
            .toFormat("jpeg")
            .toFile(`./public/midia${req.file.filename}.jpg`);
        await (0, promises_1.unlink)(req.file.path);
        res.json({ msg: "Imagem enviada" });
    }
    else {
        res.json({ msg: "arquivo invalido" });
    }
};
exports.uploadFille = uploadFille;
