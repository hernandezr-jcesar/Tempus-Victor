"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setting_controller_1 = require("../controllers/setting.controller");
const router = express_1.default.Router();
router.get("/api/settings/setting/", setting_controller_1.getSetting);
router.post("/api/settings", setting_controller_1.postSetting);
router.put("/api/settings/:idSetting", setting_controller_1.putSetting);
router.delete("/api/settings/:idSetting", setting_controller_1.deleteSetting);
exports.default = router;
