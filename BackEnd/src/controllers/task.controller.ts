import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Joi from "joi";
import { join } from "path";

const getTasks = async (req: Request, res: Response) => {
  try {
    const userID = req.query.idUser as string;

    if (!userID) {
      return res.status(400).json({ error: "Falta el parametro: personaID" });
    }

    const tasks = await prisma.task.findMany({
      where: { userId: parseInt(userID) },
      include: {
        pomodoroSession: true,
      },
    });

    res.json(tasks);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar las Tareas" });
  }
};
const getOneTask = async (req: Request, res: Response) => {
  try {
    const taskID = req.query.idTask as string;

    if (!taskID) {
      return res.status(400).json({ error: "Falta el parámetro: tareaID" });
    }

    const parsedTaskId = parseInt(taskID, 10);

    if (isNaN(parsedTaskId)) {
      return res
        .status(400)
        .json({ error: "El parámetro tareaID debe ser un número" });
    }

    const task = await prisma.task.findUnique({
      where: { idTask: parsedTaskId },
    });

    if (!task) {
      return res.status(404).json({ error: "Tarea no encontrada" });
    }

    res.json(task);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar la Tarea" });
  }
};

const postTask = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      userId: Joi.number().required(),
      categoryId: Joi.number().optional().allow(null, ""),
      title: Joi.string().required().min(3),
      description: Joi.string().required(),
      comments: Joi.string().optional().allow(null, ""),
      deadline: Joi.date().optional().allow(null, ""),
      importance: Joi.boolean().optional().allow(null, ""),
      urgency: Joi.boolean().optional().allow(null, ""),
      status: Joi.boolean().optional().allow(null, ""),
      pomodoroEstimacion: Joi.number().optional().allow(null, ""),
    });

    const {
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
    } = req.body;

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

    const createdTask = await prisma.task.create({ data: newTask });

    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando la Tarea" });
  }
};
const putTask = async (req: Request, res: Response) => {
  try {
    const IDtask = parseInt(req.params.idTask);

    const schema = Joi.object({
      categoryId: Joi.number().optional().allow(null, ""),
      title: Joi.string().required().min(3),
      description: Joi.string().required(),
      comments: Joi.string().optional().allow(null, ""),
      deadline: Joi.date().optional().allow(null, ""),
      importance: Joi.boolean().optional().allow(null, ""),
      urgency: Joi.boolean().optional().allow(null, ""),
      status: Joi.boolean().optional().allow(null, ""),
      pomodoroEstimacion: Joi.number().optional().allow(null, ""),
    });

    const {
      categoryId,
      title,
      description,
      comments,
      deadline,
      importance,
      urgency,
      status,
      pomodoroEstimacion,
    } = req.body;

    const task = req.body.values;
    const { error } = schema.validate(task);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedData = {
      ...(categoryId ? { categoryId } : {}),
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(comments ? { comments } : {}),
      ...(deadline ? { deadline } : {}),
      importance: importance !== undefined ? importance : null,
      urgency: urgency !== undefined ? urgency : null,
      status: status !== undefined ? status : null,
      ...(pomodoroEstimacion ? { pomodoroEstimacion } : {}),
    };

    const updatedTask = await prisma.task.update({
      where: { idTask: IDtask },
      data: updatedData,
    });

    if (updatedTask) {
      res.status(200).json(updatedTask);
    } else {
      res.status(404).json({ error: "Tarea no encontrada" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error actualizando la Tarea" });
  }
};

const deleteTask = async (req: Request, res: Response) => {
  try {
    const taskID = parseInt(req.params.idTask);

    const deletedTask = await prisma.task.delete({
      where: { idTask: taskID },
    });

    if (deletedTask) {
      res.status(200).json({ message: "Tarea eliminada correctamente" });
    } else {
      res.status(404).json({ error: "La Tarea no existe" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error eliminando la Tarea" });
  }
};

export { getTasks, getOneTask, postTask, putTask, deleteTask };
