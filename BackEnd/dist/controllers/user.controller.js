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
exports.deleteUser = exports.updatePassword = exports.putUser = exports.getUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.query.idUser;
        if (!userID) {
            return res.status(400).json({ error: "Falta el parámetro: userID" });
        }
        const parsedUserId = parseInt(userID, 10);
        if (isNaN(parsedUserId)) {
            return res
                .status(400)
                .json({ error: "El parámetro userID debe ser un número" });
        }
        const User = yield prisma.user.findUnique({
            where: { idUser: parsedUserId },
        });
        if (!User) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(User);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
    }
});
exports.getUser = getUser;
const putUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDUser = parseInt(req.params.idUser);
        const usernameData = req.body.username;
        const imageData = req.body.image;
        // Check if image data is present in the request
        // console.log(usernameData);
        // console.log(imageData);
        const updatedUser = yield prisma.user.update({
            where: {
                idUser: IDUser, // Replace with your logic for user ID
            },
            data: {
                username: usernameData,
                image: imageData, // Use the image data from the request body
            },
        });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        }
        else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error actualizando al Usuario" });
    }
});
exports.putUser = putUser;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDUser = parseInt(req.params.idUser);
        const newPassword = req.body.password;
        // console.log(newPassword);
        const hashedPassword = bcryptjs_1.default.hashSync(newPassword, 8);
        const updatedUser = yield prisma.user.update({
            where: {
                idUser: IDUser, // Replace with your logic for user ID
            },
            data: {
                password: hashedPassword,
            },
        });
        if (updatedUser) {
            res.status(200).json(updatedUser);
        }
        else {
            res.status(404).json({ error: "Usuario no encontrado" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error actualizando al Usuario" });
    }
});
exports.updatePassword = updatePassword;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = parseInt(req.params.idUser);
        const deletedUser = yield prisma.user.delete({
            where: { idUser: userID },
        });
        if (deletedUser) {
            res.status(200).json({ message: "Usuario eliminado correctamente" });
        }
        else {
            res.status(404).json({ error: "El usuario no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error eliminando al Usuario" });
    }
});
exports.deleteUser = deleteUser;
