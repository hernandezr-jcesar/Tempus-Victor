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
Object.defineProperty(exports, "__esModule", { value: true });
exports.postEvent = exports.getEvents = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const taskID = req.query.idTask;
        if (!taskID) {
            return res.status(400).json({ error: "Falta el parametro: id_tarea" });
        }
        const events = yield prisma.event.findMany({
            where: { taskId: parseInt(taskID) },
        });
        res.json(events);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar los eventos" });
    }
});
exports.getEvents = getEvents;
const postEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, createdAt, description } = req.body;
        const newEvent = { taskId, createdAt, description };
        const createdEvent = yield prisma.event.create({ data: newEvent });
        res.status(201).json(createdEvent);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Ocurrio un error creando el evento" });
    }
});
exports.postEvent = postEvent;
