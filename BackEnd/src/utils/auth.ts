import jwt from "jsonwebtoken";
import { Response } from "express";
import config from "../config";

const generateToken = (res: Response, idUser: string) => {
  const jwtSecret = config.JWT_SECRET || "";
  const token = jwt.sign({ idUser }, jwtSecret, {
    expiresIn: "24h",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: config.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 24000,
  });
};

const clearToken = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

export { generateToken, clearToken };
