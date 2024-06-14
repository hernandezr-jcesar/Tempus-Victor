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
exports.deleteNote = exports.putNote = exports.postNotes = exports.getOneNote = exports.getArchivedNotes = exports.getNotes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.query.idUser;
        if (!idUser) {
            return res.status(400).json({ error: "Falta el parametro: idUser" });
        }
        const notes = yield prisma.note.findMany({
            where: { userId: parseInt(idUser), NOT: { archived: true } }, // Add NOT condition to exclude archived notes
        });
        res.json(notes);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar las notas" });
    }
});
exports.getNotes = getNotes;
const getArchivedNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idUser = req.query.idUser;
        if (!idUser) {
            return res.status(400).json({ error: "Falta el parametro: idUser" });
        }
        const notes = yield prisma.note.findMany({
            where: {
                userId: parseInt(idUser),
                archived: true, // Filter for archived notes
            },
        });
        res.json(notes);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar las notas" });
    }
});
exports.getArchivedNotes = getArchivedNotes;
const getOneNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const idNote = req.query.idNote;
        if (!idNote) {
            return res.status(400).json({ error: "Falta el parámetro: idNote" });
        }
        const parsedNoteId = parseInt(idNote, 10);
        if (isNaN(parsedNoteId)) {
            return res
                .status(400)
                .json({ error: "El parámetro noteId debe ser un número" });
        }
        const note = yield prisma.note.findUnique({
            where: { idNote: parsedNoteId },
        });
        if (!note) {
            return res.status(404).json({ error: "Nota no encontrada" });
        }
        res.json(note);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar la nota" });
    }
});
exports.getOneNote = getOneNote;
const postNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            createdAt: joi_1.default.date().iso(),
            title: joi_1.default.string().required().min(3),
            description: joi_1.default.string().optional().allow(null, ""),
            archived: joi_1.default.boolean().optional().allow(null, ""),
            userId: joi_1.default.number().required(),
        });
        const { createdAt, title, description, archived, userId } = req.body;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newNote = { createdAt, title, description, archived, userId };
        const createdNote = yield prisma.note.create({ data: newNote });
        res.status(201).json(createdNote);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error creando la nota" });
    }
});
exports.postNotes = postNotes;
const putNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Idnote = parseInt(req.params.idNote);
        const schema = joi_1.default.object({
            title: joi_1.default.string().optional().min(3),
            description: joi_1.default.string().optional().allow(null, ""),
            archived: joi_1.default.boolean().optional().allow(null, ""),
        });
        const { title, description, archived } = req.body;
        const { error } = schema.validate({ title, description, archived });
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedData = Object.assign({}, req.body);
        const updatedNote = yield prisma.note.update({
            where: { idNote: Idnote },
            data: updatedData,
        });
        if (updatedNote) {
            res.status(200).json(updatedNote);
        }
        else {
            res.status(404).json({ error: "Note not found" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error actualizando la nota" });
    }
});
exports.putNote = putNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const Idnote = parseInt(req.params.idNote);
        const deletedNote = yield prisma.note.delete({
            where: { idNote: Idnote },
        });
        if (deletedNote) {
            res.status(200).json({ message: "Nota eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La nota no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error eliminando la Nota" });
    }
});
exports.deleteNote = deleteNote;
