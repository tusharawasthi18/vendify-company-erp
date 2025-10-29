import pool from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials." });
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (!rows.length) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    const user = rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials." });
    }

    if (user.is_deleted) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        companyId: user.company_id,
        roleId: user.role_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
