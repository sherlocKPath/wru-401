import express, { Router } from "express";
import { createEmployees, deleteEmployees, getAllEmployees, getEmployeesByDepartment, getFeaturedEmployees, updateEmployees } from "../controllers/employees.controller";
import { adminRoute, protectRoute } from "../middleware/auth.middleware";

const router: Router = express.Router();

router.get("/", protectRoute, adminRoute, getAllEmployees);
router.post("/create", protectRoute, adminRoute, createEmployees);
router.put("/update/:id", protectRoute, adminRoute, updateEmployees);
router.delete("/delete/:id", protectRoute, adminRoute, deleteEmployees);
router.get("/featured", getFeaturedEmployees);
router.get("/department:department", getEmployeesByDepartment);

export default router;