"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const events_controller_1 = require("../controllers/events.controller");
const router = express_1.default.Router();
router.get("/api/events/", events_controller_1.getEvents);
router.post("/api/events", events_controller_1.postEvent);
exports.default = router;
