import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

const verifyregister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingUserByEmail = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (existingUserByEmail) {
      return res.status(400).send({
        message: "¡El correo electrónico ya está en uso!",
      });
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message:
        "¡No se puede validar el nombre de usuario y el correo electrónico!",
    });
  }
};

export default verifyregister;
