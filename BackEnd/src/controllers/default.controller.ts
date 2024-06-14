import { Request, Response } from "express";

export const getDefault: (req: Request, res: Response) => void = (req, res) => {
  res.json({ message: "Welcome to Tempus Victor. )" });
};
