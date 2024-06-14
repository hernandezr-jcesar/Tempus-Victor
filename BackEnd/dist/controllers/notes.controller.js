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
exports.deleteNote = exports.putNote = exports.postNotes = exports.getOneNote = exports.getNotes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_persona = req.query.id_persona; // Type assertion
        // Optional: Filter notes based on query parameters (e.g., user ID)
        if (!id_persona) {
            // Handle the case where userId is missing
            return res.status(400).json({ error: "Falta el parametro: userId" });
        }
        // Fetch notes with related author data (using `include` for eager loading)
        const notes = yield prisma.note.findMany({
            where: { persona_id: parseInt(id_persona) }, // Parse userId to integer
            // include: { author: true },
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
const getOneNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id_nota = req.query.id_nota; // Type assertion for noteId
        if (!id_nota) {
            // Handle the case where noteId is missing (e.g., send a 400 Bad Request error)
            return res.status(400).json({ error: "Falta el parámetro: noteId" });
        }
        const parsedNoteId = parseInt(id_nota, 10); // Parse noteId to number
        if (isNaN(parsedNoteId)) {
            // Check for valid number format
            return res
                .status(400)
                .json({ error: "El parámetro noteId debe ser un número" });
        }
        // Fetch the note using prisma based on noteId
        const note = yield prisma.note.findUnique({
            where: { id_nota: parsedNoteId },
            // include: { author: true }, // Include author data (optional)
        });
        if (!note) {
            return res.status(404).json({ error: "Nota no encontrada" }); // Handle not found
        }
        res.json(note); // Send the retrieved note as JSON
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
        // Define Joi schema for validation
        const schema = joi_1.default.object({
            titulo: joi_1.default.string().required().min(3), // Title must be a string, required, and at least 3 characters long
            descripcion: joi_1.default.string().optional().allow(null, ""), // Allow updating
            persona_id: joi_1.default.number().required(), // userId must be a number and required
        });
        // Extract data from the request body
        const { titulo, descripcion, persona_id } = req.body;
        // Validate data using Joi
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message }); // Return a 400 Bad Request with the first error message
        }
        // Create a new note object with validated data
        const newNote = { titulo, descripcion, persona_id };
        // Save the new note to the database using prisma.note.create
        const createdNote = yield prisma.note.create({ data: newNote });
        res.status(201).json(createdNote); // Send the newly created note in the response
    }
    catch (error) {
        console.error(error); // Replace with proper logging mechanism
        res.status(500).json({ error: "Ocurrio un error creando la nota" });
    }
});
exports.postNotes = postNotes;
const putNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract note ID from the request path (replace with your implementation)
        const Idnote = parseInt(req.params.id_nota); // Assuming noteId is in the URL path
        // Define the Joi schema for validation (including fields to be updated)
        const schema = joi_1.default.object({
            titulo: joi_1.default.string().optional().min(3), // Allow updating title (optional)
            descripcion: joi_1.default.string().optional().allow(null, ""), // Allow updating content (optional)
        });
        // Extract data from the request body and validate
        const { titulo, descripcion } = req.body;
        const { error } = schema.validate({ titulo, descripcion }); // Validate only provided fields
        // console.log(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        // Create an update object with only the fields to be updated
        const updateData = Object.assign(Object.assign({}, (titulo ? { titulo } : {})), (descripcion ? { descripcion } : {}));
        // Update the note using prisma.note.update
        const updatedNote = yield prisma.note.update({
            where: { id_nota: Idnote },
            data: updateData,
        });
        if (updatedNote) {
            res.status(200).json(updatedNote); // Send the updated note
        }
        else {
            res.status(404).json({ error: "Note not found" }); // Handle non-existent note
        }
    }
    catch (error) {
        console.error(error); // Replace with proper logging mechanism
        res.status(500).json({ error: "Ocurrio un error actualizando la nota" });
    }
});
exports.putNote = putNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract note ID from the request path (replace with your implementation)
        const Idnote = parseInt(req.params.id_nota); // Assuming noteId is in the URL path
        // console.log(req.params);
        // console.log(req.params.id_nota);
        // Delete the note using prisma.note.delete
        const deletedNote = yield prisma.note.delete({
            where: { id_nota: Idnote },
        });
        if (deletedNote) {
            res.status(200).json({ message: "Nota eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La nota no existe" }); // Handle non-existent note
        }
    }
    catch (error) {
        console.error(error); // Replace with proper logging mechanism
        res.status(500).json({ error: "Ocurrio un error eliminando la Nota" });
    }
});
exports.deleteNote = deleteNote;
