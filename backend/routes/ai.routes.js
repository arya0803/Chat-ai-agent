import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";

const router = Router();

// Example: GET /api/ai/get-result?prompt=Hello
router.get("/get-result", aiController.getResult);

export default router;
