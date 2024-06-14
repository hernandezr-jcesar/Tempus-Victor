"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const generateToken = (res, idUser) => {
    const jwtSecret = config_1.default.JWT_SECRET || "";
    const token = jsonwebtoken_1.default.sign({ idUser }, jwtSecret, {
        expiresIn: "24h",
    });
    res.cookie("jwt", token, {
        httpOnly: true,
        secure: config_1.default.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 60 * 60 * 24000,
    });
};
exports.generateToken = generateToken;
const clearToken = (res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
};
exports.clearToken = clearToken;
