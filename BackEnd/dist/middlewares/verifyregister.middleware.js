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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyregister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingUserByEmail = yield prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
        });
        if (existingUserByEmail) {
            return res.status(400).send({
                message: "¡El correo electrónico ya está en uso!",
            });
        }
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({
            message: "¡No se puede validar el nombre de usuario y el correo electrónico!",
        });
    }
});
exports.default = verifyregister;
