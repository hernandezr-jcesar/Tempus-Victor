import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Joi from "joi";

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

const getOneSession = async (req: Request, res: Response) => {
  try {
    const taskID = req.query.idTask as string;

    if (!taskID) {
      return res.status(400).json({ error: "Falta el parámetro: idTask" });
    }

    const parsedTaskId = parseInt(taskID, 10);

    if (isNaN(parsedTaskId)) {
      return res
        .status(400)
        .json({ error: "El parámetro idTask debe ser un número" });
    }

    const session = await prisma.pomodoroSession.findUnique({
      where: { taskId: parsedTaskId },
    });

    if (!session) {
      return res.status(404).json({ error: "Sesion Pomodoro no encontrada" });
    }

    res.json(session);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
  }
};

const postSession = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      taskId: Joi.number().required(),
      status: Joi.string().optional().allow(null, ""),
      completedPomodoros: Joi.number().optional(),
      startTime: Joi.date().optional().allow(null, ""),
      endTime: Joi.date().optional().allow(null, ""),
      estimate: Joi.number().required(),
      totalTimeElapsed: Joi.number().optional().allow(null, ""),
      workTimeElapsed: Joi.number().optional().allow(null, ""),
      breakTimeElapsed: Joi.number().optional().allow(null, ""),
      remainingWorkTime: Joi.number().optional().allow(null, ""),
      remainingBreakTime: Joi.number().optional().allow(null, ""),
      currentWorkTime: Joi.number().optional().allow(null, ""),
      currentBreakTime: Joi.number().optional().allow(null, ""),
      working: Joi.boolean().optional().allow(null, ""),
      resting: Joi.boolean().optional().allow(null, ""),
    });

    const {
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
    } = req.body;

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

    const createdPomodoroSession = await prisma.pomodoroSession.create({
      data: newSession,
    });

    res.status(201).json(createdPomodoroSession);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando la sesion" });
  }
};
const putSession = async (req: Request, res: Response) => {
  try {
    const IDPomodoro = parseInt(req.params.idPomodoro);
    // console.log(IDPomodoro);

    const schema = Joi.object({
      idPomodoro: Joi.number().optional().allow(null, ""),
      taskId: Joi.number().required(),
      status: Joi.string().optional().allow(null, ""),
      completedPomodoros: Joi.number().optional(),
      startTime: Joi.date().optional().allow(null, ""),
      endTime: Joi.date().optional().allow(null, ""),
      estimate: Joi.number().optional().allow(null, ""),
      totalTimeElapsed: Joi.number().optional().allow(null, ""),
      workTimeElapsed: Joi.number().optional().allow(null, ""),
      breakTimeElapsed: Joi.number().optional().allow(null, ""),
      remainingWorkTime: Joi.number().optional().allow(null, ""),
      remainingBreakTime: Joi.number().optional().allow(null, ""),
      currentWorkTime: Joi.number().optional().allow(null, ""),
      currentBreakTime: Joi.number().optional().allow(null, ""),
      working: Joi.boolean().optional().allow(null, ""),
      resting: Joi.boolean().optional().allow(null, ""),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updateData = {
      ...req.body,
    };
    const updatedSession = await prisma.pomodoroSession.update({
      where: { idPomodoro: IDPomodoro },
      data: updateData,
    });

    if (updatedSession) {
      res.status(200).json(updatedSession);
    } else {
      res.status(404).json({ error: "Sesion no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error actualizando la Sesion" });
  }
};

const deleteSession = async (req: Request, res: Response) => {
  try {
    const pomodorosessionID = parseInt(req.params.idPomodoro);

    const deletedSession = await prisma.pomodoroSession.delete({
      where: { idPomodoro: pomodorosessionID },
    });

    if (deletedSession) {
      res
        .status(200)
        .json({ message: "Sesion Pomodoro eliminada correctamente" });
    } else {
      res.status(404).json({ error: "La Sesion Pomodoro no existe" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error eliminando la Sesion Pomodoro" });
  }
};

export { getOneSession, postSession, putSession, deleteSession };
