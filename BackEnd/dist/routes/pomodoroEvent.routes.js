"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pomodoroEvent_controllers_1 = require("../controllers/pomodoroEvent.controllers");
const router = express_1.default.Router();
router.get("/api/pomodoroEvents", pomodoroEvent_controllers_1.getPomodoroEvents);
router.post("/api/pomodoroEvents", pomodoroEvent_controllers_1.postPomodoroEvent);
exports.default = router;
