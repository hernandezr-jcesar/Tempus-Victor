import express from "express";
import {
  getPomodoroEvents,
  postPomodoroEvent,
} from "../controllers/pomodoroEvent.controllers";

const router = express.Router();

router.get("/api/pomodoroEvents", getPomodoroEvents);
router.post("/api/pomodoroEvents", postPomodoroEvent);

export default router;
