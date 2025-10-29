import pool from "../config/db.js";

export const getAllRoles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, name FROM roles ORDER BY id ASC"
    );

    return res.status(200).json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};
