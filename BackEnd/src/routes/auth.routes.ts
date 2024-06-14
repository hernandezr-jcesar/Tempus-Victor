import express from "express";
import {
  registerUser,
  authenticateUser,
  logoutUser,
} from "../controllers/auth.controller";
import verifyregister from "../middlewares/verifyregister.middleware";

const router = express.Router();

router.post("/api/auth/register", verifyregister, registerUser);
router.post("/api/auth/login", authenticateUser);
router.post("/api/auth/logout", logoutUser);

export default router;

