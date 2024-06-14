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
exports.deleteSession = exports.putSession = exports.postSession = exports.getOneSession = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
// const getAllSessions = async (req: Request, res: Response) => {
//   try {
//     const userID = req.query.idUser as string;
//     if (!userID) {
//       return res.status(400).json({ error: "Falta el parámetro: idUser" });
//     }
//     const parsedTaskId = parseInt(taskID, 10);
//     if (isNaN(parsedTaskId)) {
//       return res
//         .status(400)
//         .json({ error: "El parámetro idTask debe ser un número" });
//     }
//     const session = await prisma.pomodoroSession.findUnique({
//       where: { taskId: parsedTaskId },
//     });
//     if (!session) {
//       return res.status(404).json({ error: "Sesion Pomodoro no encontrada" });
//     }
//     res.json(session);
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
//   }
// };
const getOneSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskID = req.query.idTask;
        if (!taskID) {
            return res.status(400).json({ error: "Falta el parámetro: idTask" });
        }
        const parsedTaskId = parseInt(taskID, 10);
        if (isNaN(parsedTaskId)) {
            return res
                .status(400)
                .json({ error: "El parámetro idTask debe ser un número" });
        }
        const session = yield prisma.pomodoroSession.findUnique({
            where: { taskId: parsedTaskId },
        });
        if (!session) {
            return res.status(404).json({ error: "Sesion Pomodoro no encontrada" });
        }
        res.json(session);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
    }
});
exports.getOneSession = getOneSession;
const postSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            taskId: joi_1.default.number().required(),
            status: joi_1.default.string().optional().allow(null, ""),
            completedPomodoros: joi_1.default.number().optional(),
            startTime: joi_1.default.date().optional().allow(null, ""),
            endTime: joi_1.default.date().optional().allow(null, ""),
            estimate: joi_1.default.number().required(),
            totalTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            workTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            breakTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            remainingWorkTime: joi_1.default.number().optional().allow(null, ""),
            remainingBreakTime: joi_1.default.number().optional().allow(null, ""),
            currentWorkTime: joi_1.default.number().optional().allow(null, ""),
            currentBreakTime: joi_1.default.number().optional().allow(null, ""),
            working: joi_1.default.boolean().optional().allow(null, ""),
            resting: joi_1.default.boolean().optional().allow(null, ""),
        });
        const { taskId, status, completedPomodoros, startTime, endTime, estimate, totalTimeElapsed, workTimeElapsed, breakTimeElapsed, remainingWorkTime, remainingBreakTime, currentWorkTime, currentBreakTime, working, resting, } = req.body;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newSession = {
            taskId,
            status,
            completedPomodoros,
            startTime,
            endTime,
            estimate,
            totalTimeElapsed,
            workTimeElapsed,
            breakTimeElapsed,
            remainingWorkTime,
            remainingBreakTime,
            currentWorkTime,
            currentBreakTime,
            working,
            resting,
        };
        const createdPomodoroSession = yield prisma.pomodoroSession.create({
            data: newSession,
        });
        res.status(201).json(createdPomodoroSession);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error creando la sesion" });
    }
});
exports.postSession = postSession;
const putSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDPomodoro = parseInt(req.params.idPomodoro);
        // console.log(IDPomodoro);
        const schema = joi_1.default.object({
            idPomodoro: joi_1.default.number().optional().allow(null, ""),
            taskId: joi_1.default.number().required(),
            status: joi_1.default.string().optional().allow(null, ""),
            completedPomodoros: joi_1.default.number().optional(),
            startTime: joi_1.default.date().optional().allow(null, ""),
            endTime: joi_1.default.date().optional().allow(null, ""),
            estimate: joi_1.default.number().optional().allow(null, ""),
            totalTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            workTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            breakTimeElapsed: joi_1.default.number().optional().allow(null, ""),
            remainingWorkTime: joi_1.default.number().optional().allow(null, ""),
            remainingBreakTime: joi_1.default.number().optional().allow(null, ""),
            currentWorkTime: joi_1.default.number().optional().allow(null, ""),
            currentBreakTime: joi_1.default.number().optional().allow(null, ""),
            working: joi_1.default.boolean().optional().allow(null, ""),
            resting: joi_1.default.boolean().optional().allow(null, ""),
        });
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updateData = Object.assign({}, req.body);
        const updatedSession = yield prisma.pomodoroSession.update({
            where: { idPomodoro: IDPomodoro },
            data: updateData,
        });
        if (updatedSession) {
            res.status(200).json(updatedSession);
        }
        else {
            res.status(404).json({ error: "Sesion no encontrada" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error actualizando la Sesion" });
    }
});
exports.putSession = putSession;
const deleteSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pomodorosessionID = parseInt(req.params.idPomodoro);
        const deletedSession = yield prisma.pomodoroSession.delete({
            where: { idPomodoro: pomodorosessionID },
        });
        if (deletedSession) {
            res
                .status(200)
                .json({ message: "Sesion Pomodoro eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La Sesion Pomodoro no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error eliminando la Sesion Pomodoro" });
    }
});
exports.deleteSession = deleteSession;
