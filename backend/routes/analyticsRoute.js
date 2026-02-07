import express from "express";
import { getDailyStats } from "../controllers/analyticsController.js";

const router = express.Router();
router.get("/daily", getDailyStats);

export default router;