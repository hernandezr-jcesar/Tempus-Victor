import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Joi from "joi";

const getNotes = async (req: Request, res: Response) => {
  try {
    const idUser = req.query.idUser as string;
    if (!idUser) {
      return res.status(400).json({ error: "Falta el parametro: idUser" });
    }

    const notes = await prisma.note.findMany({
      where: { userId: parseInt(idUser), NOT: { archived: true } }, // Add NOT condition to exclude archived notes
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar las notas" });
  }
};
const getArchivedNotes = async (req: Request, res: Response) => {
  try {
    const idUser = req.query.idUser as string;
    if (!idUser) {
      return res.status(400).json({ error: "Falta el parametro: idUser" });
    }

    const notes = await prisma.note.findMany({
      where: {
        userId: parseInt(idUser),
        archived: true, // Filter for archived notes
      },
    });

    res.json(notes);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar las notas" });
  }
};
const getOneNote = async (req: Request, res: Response) => {
  try {
    const idNote = req.query.idNote as string;

    if (!idNote) {
      return res.status(400).json({ error: "Falta el parámetro: idNote" });
    }

    const parsedNoteId = parseInt(idNote, 10);
    if (isNaN(parsedNoteId)) {
      return res
        .status(400)
        .json({ error: "El parámetro noteId debe ser un número" });
    }

    const note = await prisma.note.findUnique({
      where: { idNote: parsedNoteId },
    });

    if (!note) {
      return res.status(404).json({ error: "Nota no encontrada" });
    }

    res.json(note);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar la nota" });
  }
};

const postNotes = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      createdAt: Joi.date().iso(),
      title: Joi.string().required().min(3),
      description: Joi.string().optional().allow(null, ""),
      archived: Joi.boolean().optional().allow(null, ""),
      userId: Joi.number().required(),
    });

    const { createdAt, title, description, archived, userId } = req.body;

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newNote = { createdAt, title, description, archived, userId };

    const createdNote = await prisma.note.create({ data: newNote });

    res.status(201).json(createdNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando la nota" });
  }
};
const putNote = async (req: Request, res: Response) => {
  try {
    const Idnote = parseInt(req.params.idNote);
    const schema = Joi.object({
      title: Joi.string().optional().min(3),
      description: Joi.string().optional().allow(null, ""),
      archived: Joi.boolean().optional().allow(null, ""),
    });

    const { title, description, archived } = req.body;
    const { error } = schema.validate({ title, description, archived });

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const updatedData = {
      ...req.body,
    };

    const updatedNote = await prisma.note.update({
      where: { idNote: Idnote },
      data: updatedData,
    });

    if (updatedNote) {
      res.status(200).json(updatedNote);
    } else {
      res.status(404).json({ error: "Note not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error actualizando la nota" });
  }
};

const deleteNote = async (req: Request, res: Response) => {
  try {
    const Idnote = parseInt(req.params.idNote);

    const deletedNote = await prisma.note.delete({
      where: { idNote: Idnote },
    });

    if (deletedNote) {
      res.status(200).json({ message: "Nota eliminada correctamente" });
    } else {
      res.status(404).json({ error: "La nota no existe" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error eliminando la Nota" });
  }
};

export {
  getNotes,
  getArchivedNotes,
  getOneNote,
  postNotes,
  putNote,
  deleteNote,
};
