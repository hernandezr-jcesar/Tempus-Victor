import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const getPomodoroEvents = async (req: Request, res: Response) => {
  try {
    const pomodoroID = req.query.idPomodoro as string;

    if (!pomodoroID) {
      return res.status(400).json({ error: "Falta el parametro: idPomodoro" });
    }

    const pomodoroEvents = await prisma.pomodoroEvent.findMany({
      where: { pomodoroSessionId: parseInt(pomodoroID) },
    });

    res.json(pomodoroEvents);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar los eventos" });
  }
};

const postPomodoroEvent = async (req: Request, res: Response) => {
  try {
    const { pomodoroSessionId, createdAt, description } = req.body;

    const newPomodoroEvent = { pomodoroSessionId, createdAt, description };

    const createdEvent = await prisma.pomodoroEvent.create({
      data: newPomodoroEvent,
    });

    res.status(201).json(createdEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando el evento" });
  }
};

export { getPomodoroEvents, postPomodoroEvent };
