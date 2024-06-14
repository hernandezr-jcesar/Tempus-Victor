import express from "express";
import {
  getCategories,
  postCategory,
  deleteCategory,
} from "../controllers/category.controller";

const router = express.Router();

router.get("/api/categories/", getCategories);
router.post("/api/categories", postCategory);
router.delete("/api/categories/:idCategory", deleteCategory);

export default router;
