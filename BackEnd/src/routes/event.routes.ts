import express from "express";
import { getEvents, postEvent } from "../controllers/event.controller";

const router = express.Router();

router.get("/api/events/", getEvents);
router.post("/api/events", postEvent);

export default router;
