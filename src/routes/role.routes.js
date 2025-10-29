import express from "express";
import { getAllRoles } from "../controllers/role.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", authenticate, getAllRoles);

export default router;
