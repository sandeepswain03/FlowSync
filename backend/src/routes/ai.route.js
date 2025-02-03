import { Router } from "express";
import { getResult } from "../controllers/ai.controller.js";
import checkAuth from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/get-result", checkAuth, getResult);

export default router;
