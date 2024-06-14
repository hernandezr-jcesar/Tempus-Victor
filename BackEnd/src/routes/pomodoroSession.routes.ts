import express from "express";
import {
  getOneSession,
  postSession,
  putSession,
  deleteSession,
} from "../controllers/pomodoroSession.controller";

const router = express.Router();

router.get("/api/pomodoroSessions/session/", getOneSession);
router.post("/api/pomodoroSessions", postSession);
router.put("/api/pomodoroSessions/:idPomodoro", putSession);
router.delete("/api/pomodoroSessions/:idPomodoro", deleteSession);

export default router;
