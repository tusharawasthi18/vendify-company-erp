import "./loadEnv.js";
import fs from "fs";
import app from "./app.js";
import pool from "./config/db.js";

const initializeDB = async () => {
  const schema = fs.readFileSync("./src/migrations/schema.sql", "utf8");
  const connection = await pool.getConnection();
  try {
    const queries = schema
      .split(";")
      .map((q) => q.trim())
      .filter(Boolean);
    for (const query of queries) {
      await connection.query(query);
    }

    console.log("Database schema ready");
  } finally {
    connection.release();
  }
};

const startServer = async () => {
  try {
    await initializeDB();

    app.listen(process.env.PORT, () => {
      console.log(`Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("DB error:", err);
  }
};

startServer();
