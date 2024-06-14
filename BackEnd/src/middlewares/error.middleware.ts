import { NextFunction, Request, Response } from "express";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (err instanceof AuthenticationError) {
    res.status(401).json({ message: "Sin autorización: " + err.message });
  } else {
    res.status(500).json({ message: "Error Interno del Servidor" });
  }
};

class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

export { errorHandler, AuthenticationError };
