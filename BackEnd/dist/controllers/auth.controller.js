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
exports.logoutUser = exports.authenticateUser = exports.registerUser = void 0;
const auth_1 = require("../utils/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const hashedPassword = bcryptjs_1.default.hashSync(password, 8);
    const user = yield prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
        },
    });
    if (user) {
        (0, auth_1.generateToken)(res, user.idUser.toString());
        res.status(201).send({
            idUser: user.idUser,
            username: user.username,
            email: user.email,
            message: "Usuario creado correctamente!",
        });
    }
    else {
        res
            .status(500)
            .send({ message: "Ocurrio un error tratando de crear el usuario" });
    }
});
exports.registerUser = registerUser;
const authenticateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return res.status(404).send({ message: "El usuario no existe!" });
    }
    const passwordIsValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({ message: "Contraseña incorrecta!" });
    }
    if (user && passwordIsValid) {
        (0, auth_1.generateToken)(res, user.idUser.toString());
        res.status(201).send({
            idUser: user.idUser,
            username: user.username,
            email: user.email,
            message: "Accediste correctamente!",
        });
    }
    else {
        res
            .status(500)
            .send({ message: "Ocurrio un error autenticando al usuario!!!" });
    }
});
exports.authenticateUser = authenticateUser;
const logoutUser = (req, res) => {
    (0, auth_1.clearToken)(res);
    res.status(200).send({ message: "Saliste del sistem" });
};
exports.logoutUser = logoutUser;
