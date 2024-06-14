"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_controller_1 = require("../controllers/task.controller");
const router = express_1.default.Router();
router.get("/api/tasks/", task_controller_1.getTasks);
router.get("/api/tasks/task/", task_controller_1.getOneTask);
router.post("/api/tasks", task_controller_1.postTask);
router.put("/api/tasks/:id_tarea", task_controller_1.putTask);
router.delete("/api/tasks/:id_tarea", task_controller_1.deleteTask);
exports.default = router;
