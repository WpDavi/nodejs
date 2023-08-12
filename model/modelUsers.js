"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize_2 = require("../database/sequelize");
const Users = sequelize_2.sequelize.define("Users", {
    id: {
        primaryKey: true,
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
    },
    number: {
        type: sequelize_1.DataTypes.STRING,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
    },
    fone: {
        type: sequelize_1.DataTypes.STRING,
    },
    blood: {
        type: sequelize_1.DataTypes.STRING,
    },
    token: {
        type: sequelize_1.DataTypes.STRING,
    },
    photoperfil: {
        type: sequelize_1.DataTypes.STRING,
    },
}, {
    tableName: "Users",
    timestamps: false,
});
exports.default = Users;
