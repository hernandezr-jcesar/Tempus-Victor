"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_controller_1 = require("../controllers/note.controller");
const router = express_1.default.Router();
router.get("/api/notes/", note_controller_1.getNotes);
router.get("/api/notes/archived/", note_controller_1.getArchivedNotes);
router.get("/api/notes/note/", note_controller_1.getOneNote);
router.post("/api/notes", note_controller_1.postNotes);
router.put("/api/notes/:idNote", note_controller_1.putNote);
router.delete("/api/notes/:idNote", note_controller_1.deleteNote);
exports.default = router;
