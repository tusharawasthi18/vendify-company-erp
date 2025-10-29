import express from "express";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/roles", roleRoutes);

export default app;
