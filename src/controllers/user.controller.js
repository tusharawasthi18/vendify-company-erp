import pool from "../config/db.js";
import bcrypt from "bcrypt";

const localCache = {};

export const createUser = async (req, res) => {
  try {
    const { name, email, password, role_id } = req.body || {};
    const { userId, companyId } = req.user;

    if (!name || !email || !password || !role_id) {
      return res.status(401).json({
        success: false,
        message: "Missing required fields: name, email, password, and role_id",
      });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO users (company_id, role_id, name, email, password, created_by)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [companyId, role_id, name, email, hashedPassword, userId]
    );

    localCache[`company:${companyId}`] = localCache[`company:${companyId}`]
      ? localCache[`company:${companyId}`] + 1
      : 1;

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const { companyId } = req.user;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT u.id, u.name, u.email, r.name AS role
       FROM users u
       JOIN roles r ON u.role_id = r.id
       WHERE u.company_id = ? AND u.is_deleted = FALSE
       ORDER BY u.name
       LIMIT ? OFFSET ?`,
      [companyId, parseInt(limit), parseInt(offset)]
    );

    // to be changed with redis for production
    let total = 0;

    if (localCache[`company:${companyId}`]) {
      total = localCache[`company:${companyId}`];
    } else {
      const [totalRows] = await pool.query(
        `SELECT COUNT(*) AS count FROM users WHERE company_id = ? AND is_deleted = FALSE`,
        [companyId]
      );

      total = totalRows[0].count;
      localCache[`company:${companyId}`] = total;
    }

    return res.status(200).json({
      success: true,
      total: total,
      page: parseInt(page),
      data: rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMe = async (req, res) => {
  try {
    const { userId } = req.user || {};

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Missing or invalid authentication token.",
      });
    }

    const [rows] = await pool.query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        r.name AS role, 
        c.name AS company
      FROM users u
      JOIN roles r ON u.role_id = r.id
      JOIN companies c ON u.company_id = c.id
      WHERE u.id = ? AND u.is_deleted = FALSE`,
      [userId]
    );

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
