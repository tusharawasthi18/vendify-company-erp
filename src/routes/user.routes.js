import express from "express";
import {
  createUser,
  getAllUsers,
  getMe,
} from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRoles } from "../middlewares/role.middleware.js";

const router = express.Router();

router.post("/", authenticate, authorizeRoles("CA"), createUser);
router.get("/", authenticate, getAllUsers);
router.get("/me", authenticate, getMe);

export default router;
