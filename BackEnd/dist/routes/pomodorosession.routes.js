"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pomodoroSession_controller_1 = require("../controllers/pomodoroSession.controller");
const router = express_1.default.Router();
router.get("/api/pomodoroSessions/session/", pomodoroSession_controller_1.getOneSession);
router.post("/api/pomodoroSessions", pomodoroSession_controller_1.postSession);
router.put("/api/pomodoroSessions/:idPomodoro", pomodoroSession_controller_1.putSession);
router.delete("/api/pomodoroSessions/:idPomodoro", pomodoroSession_controller_1.deleteSession);
exports.default = router;
