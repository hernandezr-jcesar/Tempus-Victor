import express from "express";
import {
  putUser,
  updatePassword,
  deleteUser,
  getUser,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/api/users/user/", getUser);
router.put("/api/users/:idUser", putUser);
router.put("/api/users/password/:idUser", updatePassword);
router.delete("/api/users/:idUser", deleteUser);

export default router;
