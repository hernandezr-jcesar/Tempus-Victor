"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.get("/api/users/user/", user_controller_1.getUser);
router.put("/api/users/:idUser", user_controller_1.putUser);
router.put("/api/users/password/:idUser", user_controller_1.updatePassword);
router.delete("/api/users/:idUser", user_controller_1.deleteUser);
exports.default = router;
