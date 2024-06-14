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
exports.allAccess = exports.getUser = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const user = yield prisma.user.findUnique({
        where: { id: userId }, // Use 'id' instead of decoded.userId
        select: { username: true, email: true }, // Select specific fields
    });
    if (!user) {
        res.status(400);
    }
    res.status(200).json(user);
});
exports.getUser = getUser;
const allAccess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("Public Content.");
});
exports.allAccess = allAccess;
