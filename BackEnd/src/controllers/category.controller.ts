import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import Joi from "joi";

const getCategories = async (req: Request, res: Response) => {
  try {
    const userID = req.query.idUser as string;

    if (!userID) {
      return res.status(400).json({ error: "Falta el parametro: userId" });
    }

    const userCategories = await prisma.category.findMany({
      where: {
        OR: [
          { userId: parseInt(userID) }, // Categorías personalizadas
          { isPersonalized: false }, // Categorías predefinidas
        ],
      },
    });

    res.json(userCategories);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Ocurrio un error tratando de buscar las categorias" });
  }
};

const postCategory = async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({
      userId: Joi.number().optional().allow(null, ""),
      name: Joi.string().required(),
      isPersonalized: Joi.boolean().optional().allow(null, ""),
    });

    const { userId, name, isPersonalized } = req.body;

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const newCategory = {
      userId,
      name,
      isPersonalized,
    };

    const createdCategory = await prisma.category.create({
      data: newCategory,
    });

    res.status(201).json(createdCategory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error creando la Categoria" });
  }
};

const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryID = parseInt(req.params.idCategory);

    const deletedCategory = await prisma.category.delete({
      where: { idCategory: categoryID },
    });

    if (deletedCategory) {
      res.status(200).json({ message: "Categoria eliminada correctamente" });
    } else {
      res.status(404).json({ error: "La Categoria no existe" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocurrio un error eliminando la Categoria" });
  }
};

export { getCategories, postCategory, deleteCategory };
