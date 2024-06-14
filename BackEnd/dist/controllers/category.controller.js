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
exports.deleteCategory = exports.postCategory = exports.getCategories = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
const getCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.query.idUser;
        if (!userID) {
            return res.status(400).json({ error: "Falta el parametro: userId" });
        }
        const userCategories = yield prisma.category.findMany({
            where: {
                OR: [
                    { userId: parseInt(userID) }, // Categorías personalizadas
                    { isPersonalized: false }, // Categorías predefinidas
                ],
            },
        });
        res.json(userCategories);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar las categorias" });
    }
});
exports.getCategories = getCategories;
const postCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            userId: joi_1.default.number().optional().allow(null, ""),
            name: joi_1.default.string().required(),
            isPersonalized: joi_1.default.boolean().optional().allow(null, ""),
        });
        const { userId, name, isPersonalized } = req.body;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newCategory = {
            userId,
            name,
            isPersonalized,
        };
        const createdCategory = yield prisma.category.create({
            data: newCategory,
        });
        res.status(201).json(createdCategory);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error creando la Categoria" });
    }
});
exports.postCategory = postCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryID = parseInt(req.params.idCategory);
        const deletedCategory = yield prisma.category.delete({
            where: { idCategory: categoryID },
        });
        if (deletedCategory) {
            res.status(200).json({ message: "Categoria eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La Categoria no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error eliminando la Categoria" });
    }
});
exports.deleteCategory = deleteCategory;
