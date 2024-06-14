import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getEvents = async (req: Request, res: Response) => {
  try {
    const taskID = req.query.idTask as string;

    if (!taskID) {
      return res.status(400).json({ error: "Falta el parametro: id_tarea" });
    }

    const events = await prisma.event.findMany({
      where: { taskId: parseInt(taskID) },
    });

    res.json(events);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar los eventos" });
  }
};

const postEvent = async (req: Request, res: Response) => {
  try {
    const { taskId, createdAt, description } = req.body;

    const newEvent = { taskId, createdAt, description };

    const createdEvent = await prisma.event.create({ data: newEvent });

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando el evento" });
  }
};

export { getEvents, postEvent };
