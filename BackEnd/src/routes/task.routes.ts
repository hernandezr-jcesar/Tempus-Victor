import express from "express";
import {
  getTasks,
  postTask,
  putTask,
  deleteTask,
  getOneTask,
} from "../controllers/task.controller";

const router = express.Router();

router.get("/api/tasks/", getTasks);
router.get("/api/tasks/task/", getOneTask);
router.post("/api/tasks", postTask);
router.put("/api/tasks/:idTask", putTask);
router.delete("/api/tasks/:idTask", deleteTask);

export default router;
