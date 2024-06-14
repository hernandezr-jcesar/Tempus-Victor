"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.get("/api/categories/", category_controller_1.getCategories);
router.post("/api/categories", category_controller_1.postCategory);
router.delete("/api/categories/:idCategory", category_controller_1.deleteCategory);
exports.default = router;
