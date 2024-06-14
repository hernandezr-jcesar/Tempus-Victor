import express from "express";
import {
  getNotes,
  postNotes,
  putNote,
  deleteNote,
  getOneNote,
  getArchivedNotes,
} from "../controllers/note.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

router.get("/api/notes/", getNotes);
router.get("/api/notes/archived/", getArchivedNotes);
router.get("/api/notes/note/", getOneNote);
router.post("/api/notes", postNotes);
router.put("/api/notes/:idNote", putNote);
router.delete("/api/notes/:idNote", deleteNote);

export default router;
