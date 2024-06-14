import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Joi from "joi";

const getSetting = async (req: Request, res: Response) => {
  try {
    const userID = req.query.idUser as string;

    if (!userID) {
      return res.status(400).json({ error: "Falta el parámetro: idUser" });
    }

    const setting = await prisma.setting.findUnique({
      where: { userId: parseInt(userID) },
    });

    if (!setting) {
      return res.status(404).json({ error: "Configuración no encontrada" });
    }

    res.json(setting);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar la Configuración" });
  }
};

const postSetting = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      userId: Joi.number().required(),
      pomodoroWorkDuration: Joi.number().required(),
      shortBreakDuration: Joi.number().required(),
      longBreakDuration: Joi.number().required(),
      workImg: Joi.number().required(),
      breakImg: Joi.number().required(),
      neglectedImg: Joi.number().required(),
      alarmSound: Joi.number().required(),
      tictacSound: Joi.number().required(),
    });

    const {
      userId,
      pomodoroWorkDuration,
      shortBreakDuration,
      longBreakDuration,
      workImg,
      breakImg,
      neglectedImg,
      alarmSound,
      tictacSound,
    } = req.body;

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

    const createdSetting = await prisma.setting.create({
      data: newSetting,
    });

    res.status(201).json(createdSetting);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error creando la Configuración" });
  }
};
const putSetting = async (req: Request, res: Response) => {
  try {
    const IDsetting = parseInt(req.params.idSetting);

    const schema = Joi.object({
      pomodoroWorkDuration: Joi.number().optional(),
      shortBreakDuration: Joi.number().optional(),
      longBreakDuration: Joi.number().optional(),
      workImg: Joi.number().required(),
      breakImg: Joi.number().required(),
      neglectedImg: Joi.number().required(),
      alarmSound: Joi.number().required(),
      tictacSound: Joi.number().required(),
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

    const updatedData = {
      ...req.body,
    };

    const updatedSetting = await prisma.setting.update({
      where: { idSetting: IDsetting },
      data: updatedData,
    });

    if (updatedSetting) {
      res.status(200).json(updatedSetting);
    } else {
      res.status(404).json({ error: "Configuración no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error actualizando la Configuración" });
  }
};

const deleteSetting = async (req: Request, res: Response) => {
  try {
    const settingID = parseInt(req.params.idSetting);

    const deletedSetting = await prisma.setting.delete({
      where: { idSetting: settingID },
    });

    if (deletedSetting) {
      res
        .status(200)
        .json({ message: "Configuración eliminada correctamente" });
    } else {
      res.status(404).json({ error: "La Configuración no existe" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error eliminando la Configuración" });
  }
};

export { getSetting, postSetting, putSetting, deleteSetting };
