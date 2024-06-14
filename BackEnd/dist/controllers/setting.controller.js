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
exports.deleteSetting = exports.putSetting = exports.postSetting = exports.getSetting = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const joi_1 = __importDefault(require("joi"));
const getSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userID = req.query.idUser;
        if (!userID) {
            return res.status(400).json({ error: "Falta el parámetro: idUser" });
        }
        const setting = yield prisma.setting.findUnique({
            where: { userId: parseInt(userID) },
        });
        if (!setting) {
            return res.status(404).json({ error: "Configuración no encontrada" });
        }
        res.json(setting);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error tratando de buscar la Configuración" });
    }
});
exports.getSetting = getSetting;
const postSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const schema = joi_1.default.object({
            userId: joi_1.default.number().required(),
            pomodoroWorkDuration: joi_1.default.number().required(),
            shortBreakDuration: joi_1.default.number().required(),
            longBreakDuration: joi_1.default.number().required(),
            workImg: joi_1.default.number().required(),
            breakImg: joi_1.default.number().required(),
            neglectedImg: joi_1.default.number().required(),
            alarmSound: joi_1.default.number().required(),
            tictacSound: joi_1.default.number().required(),
        });
        const { userId, pomodoroWorkDuration, shortBreakDuration, longBreakDuration, workImg, breakImg, neglectedImg, alarmSound, tictacSound, } = req.body;
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const newSetting = {
            userId,
            pomodoroWorkDuration,
            shortBreakDuration,
            longBreakDuration,
            workImg,
            breakImg,
            neglectedImg,
            alarmSound,
            tictacSound,
        };
        const createdSetting = yield prisma.setting.create({
            data: newSetting,
        });
        res.status(201).json(createdSetting);
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error creando la Configuración" });
    }
});
exports.postSetting = postSetting;
const putSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const IDsetting = parseInt(req.params.idSetting);
        const schema = joi_1.default.object({
            pomodoroWorkDuration: joi_1.default.number().optional(),
            shortBreakDuration: joi_1.default.number().optional(),
            longBreakDuration: joi_1.default.number().optional(),
            workImg: joi_1.default.number().required(),
            breakImg: joi_1.default.number().required(),
            neglectedImg: joi_1.default.number().required(),
            alarmSound: joi_1.default.number().required(),
            tictacSound: joi_1.default.number().required(),
        });
        // const {
        //   pomodoroWorkDuration,
        //   shortBreakDuration,
        //   longBreakDuration,
        //   workImg,
        //   breakImg,
        //   neglectedImg,
        //   alarmSound,
        //   tictacSound,
        // } = req.body;
        const setting = req.body.values;
        const { error } = schema.validate(setting);
        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }
        const updatedData = Object.assign({}, req.body);
        const updatedSetting = yield prisma.setting.update({
            where: { idSetting: IDsetting },
            data: updatedData,
        });
        if (updatedSetting) {
            res.status(200).json(updatedSetting);
        }
        else {
            res.status(404).json({ error: "Configuración no encontrada" });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error actualizando la Configuración" });
    }
});
exports.putSetting = putSetting;
const deleteSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settingID = parseInt(req.params.idSetting);
        const deletedSetting = yield prisma.setting.delete({
            where: { idSetting: settingID },
        });
        if (deletedSetting) {
            res
                .status(200)
                .json({ message: "Configuración eliminada correctamente" });
        }
        else {
            res.status(404).json({ error: "La Configuración no existe" });
        }
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ error: "Ocurrio un error eliminando la Configuración" });
    }
});
exports.deleteSetting = deleteSetting;
