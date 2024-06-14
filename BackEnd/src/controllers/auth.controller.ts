import { Request, Response } from "express";
import { generateToken, clearToken } from "../utils/auth";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 8);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  if (user) {
    generateToken(res, user.idUser.toString());
    res.status(201).send({
      idUser: user.idUser,
      username: user.username,
      email: user.email,
      message: "Usuario creado correctamente!",
    });
  } else {
    res
      .status(500)
      .send({ message: "Ocurrio un error tratando de crear el usuario" });
  }
};

const authenticateUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res.status(404).send({ message: "El usuario no existe!" });
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    return res.status(401).send({ message: "Contraseña incorrecta!" });
  }

  if (user && passwordIsValid) {
    generateToken(res, user.idUser.toString());
    res.status(201).send({
      idUser: user.idUser,
      username: user.username,
      email: user.email,
      message: "Accediste correctamente!",
    });
  } else {
    res
      .status(500)
      .send({ message: "Ocurrio un error autenticando al usuario!!!" });
  }
};

const logoutUser = (req: Request, res: Response) => {
  clearToken(res);
  res.status(200).send({ message: "Saliste del sistem" });
};

export { registerUser, authenticateUser, logoutUser };
