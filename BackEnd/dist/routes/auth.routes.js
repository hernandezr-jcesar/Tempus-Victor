"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const verifyregister_middleware_1 = __importDefault(require("../middlewares/verifyregister.middleware"));
const router = express_1.default.Router();
router.post("/api/auth/register", verifyregister_middleware_1.default, auth_controller_1.registerUser);
router.post("/api/auth/login", auth_controller_1.authenticateUser);
router.post("/api/auth/logout", auth_controller_1.logoutUser);
exports.default = router;
