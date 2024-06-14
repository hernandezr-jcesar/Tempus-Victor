"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const config_1 = __importDefault(require("../config"));
const error_middleware_1 = require("./error.middleware");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const authenticate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.cookies.jwt;
        if (!token) {
            throw new error_middleware_1.AuthenticationError("No existe el Token");
        }
        const jwtSecret = config_1.default.JWT_SECRET;
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        console.log("Decoded: ", decoded);
        console.log(decoded);
        if (!decoded || !decoded.idUser) {
            res.status(401);
            throw new error_middleware_1.AuthenticationError("Sin autorización, no existe el id_persona");
        }
        const user = yield prisma.user.findUnique({
            where: { idUser: decoded.idUser },
        });
        if (!user) {
            res.status(401);
            throw new error_middleware_1.AuthenticationError("Sin autorización, no existe el usuario");
        }
        req.user = user;
        next();
    }
    catch (e) {
        res.status(401);
        throw new error_middleware_1.AuthenticationError("Sin autorización, token invalido");
    }
}));
exports.authenticate = authenticate;
