import express, { Router } from "express";
import { addWorkLog, deleteWorkLog, getWorkLog, updateWorkLog } from "../controllers/worklog.controller";
import { protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/", protectRoute, getWorkLog);
router.post("/addwork", protectRoute, addWorkLog);
router.post("/updatework/:id", protectRoute, updateWorkLog);
router.post("/deletework/:id", protectRoute, deleteWorkLog);

export default router;