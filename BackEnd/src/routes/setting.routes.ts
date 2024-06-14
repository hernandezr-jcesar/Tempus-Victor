import express from "express";
import {
  getSetting,
  postSetting,
  putSetting,
  deleteSetting,
} from "../controllers/setting.controller";

const router = express.Router();

router.get("/api/settings/setting/", getSetting);
router.post("/api/settings", postSetting);
router.put("/api/settings/:idSetting", putSetting);
router.delete("/api/settings/:idSetting", deleteSetting);

export default router;
