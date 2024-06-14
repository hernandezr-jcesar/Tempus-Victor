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
exports.deleteTask = exports.putTask = exports.postTask = exports.getOneTask = exports.getTasks = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.query.idUser;
        if (!userID) {
            return res.status(400).json({ error: "Falta el parametro: personaID" });
        }
        const tasks = yield prisma.task.findMany({
            where: { userId: parseInt(userID) },
            include: {
                pomodoroSession: true,
            },
        });
        res.json(tasks);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar las Tareas" });
    }
});
exports.getTasks = getTasks;
const getOneTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskID = req.query.idTask;
        if (!taskID) {
            return res.status(400).json({ error: "Falta el parámetro: tareaID" });
        }
        const parsedTaskId = parseInt(taskID, 10);
        if (isNaN(parsedTaskId)) {
            return res
                .status(400)
                .json({ error: "El parámetro tareaID debe ser un número" });
        }
        const task = yield prisma.task.findUnique({
            where: { idTask: parsedTaskId },
        });
        if (!task) {
            return res.status(404).json({ error: "Tarea no encontrada" });
        }
        res.json(task);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
    }
});
exports.getOneTask = getOneTask;
const postTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            userId: joi_1.default.number().required(),
            categoryId: joi_1.default.number().optional().allow(null, ""),
            title: joi_1.default.string().required().min(3),
            description: joi_1.default.string().required(),
            comments: joi_1.default.string().optional().allow(null, ""),
            deadline: joi_1.default.date().optional().allow(null, ""),
            importance: joi_1.default.boolean().optional().allow(null, ""),
            urgency: joi_1.default.boolean().optional().allow(null, ""),
            status: joi_1.default.boolean().optional().allow(null, ""),
            pomodoroEstimacion: joi_1.default.number().optional().allow(null, ""),
        });
        const { userId, categoryId, title, description, comments, deadline, importance, urgency, status, pomodoroEstimacion, } = req.body;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newTask = {
            userId,
            categoryId,
            title,
            description,
            comments,
            deadline,
            importance,
            urgency,
            status,
            pomodoroEstimacion,
        };
        const createdTask = yield prisma.task.create({ data: newTask });
        res.status(201).json(createdTask);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error creando la Tarea" });
    }
});
exports.postTask = postTask;
const putTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDtask = parseInt(req.params.idTask);
        const schema = joi_1.default.object({
            categoryId: joi_1.default.number().optional().allow(null, ""),
            title: joi_1.default.string().required().min(3),
            description: joi_1.default.string().required(),
            comments: joi_1.default.string().optional().allow(null, ""),
            deadline: joi_1.default.date().optional().allow(null, ""),
            importance: joi_1.default.boolean().optional().allow(null, ""),
            urgency: joi_1.default.boolean().optional().allow(null, ""),
            status: joi_1.default.boolean().optional().allow(null, ""),
            pomodoroEstimacion: joi_1.default.number().optional().allow(null, ""),
        });
        const { categoryId, title, description, comments, deadline, importance, urgency, status, pomodoroEstimacion, } = req.body;
        const task = req.body.values;
        const { error } = schema.validate(task);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedData = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (categoryId ? { categoryId } : {})), (title ? { title } : {})), (description ? { description } : {})), (comments ? { comments } : {})), (deadline ? { deadline } : {})), { importance: importance !== undefined ? importance : null, urgency: urgency !== undefined ? urgency : null, status: status !== undefined ? status : null }), (pomodoroEstimacion ? { pomodoroEstimacion } : {}));
        const updatedTask = yield prisma.task.update({
            where: { idTask: IDtask },
            data: updatedData,
        });
        if (updatedTask) {
            res.status(200).json(updatedTask);
        }
        else {
            res.status(404).json({ error: "Tarea no encontrada" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error actualizando la Tarea" });
    }
});
exports.putTask = putTask;
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskID = parseInt(req.params.idTask);
        const deletedTask = yield prisma.task.delete({
            where: { idTask: taskID },
        });
        if (deletedTask) {
            res.status(200).json({ message: "Tarea eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La Tarea no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error eliminando la Tarea" });
    }
});
exports.deleteTask = deleteTask;
