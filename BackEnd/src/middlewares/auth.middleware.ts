import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import config from "../config";
import { AuthenticationError } from "./error.middleware";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let token = req.cookies.jwt;

      if (!token) {
        throw new AuthenticationError("No existe el Token");
      }

      const jwtSecret = config.JWT_SECRET;
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

      console.log("Decoded: ", decoded);
      console.log(decoded);

      if (!decoded || !decoded.idUser) {
        res.status(401);
        throw new AuthenticationError(
          "Sin autorización, no existe el id_persona"
        );
      }

      const user = await prisma.user.findUnique({
        where: { idUser: decoded.idUser },
      });

      if (!user) {
        res.status(401);
        throw new AuthenticationError("Sin autorización, no existe el usuario");
      }

      req.user = user;
      next();
    } catch (e) {
      res.status(401);
      throw new AuthenticationError("Sin autorización, token invalido");
    }
  }
);

export { authenticate };
