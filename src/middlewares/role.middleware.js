import pool from "../config/db.js";

export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const { roleId } = req.user;

      const [roles] = await pool.query("SELECT name FROM roles WHERE id = ?", [
        roleId,
      ]);
      if (!roles.length) {
        return res
          .status(403)
          .json({ success: false, message: "Role not found" });
      }

      const userRole = roles[0].name;

      if (!allowedRoles.includes(userRole)) {
        return res
          .status(403)
          .json({
            success: false,
            message: `Access denied: ${userRole} role cannot perform this action.`,
          });
      }

      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal server error" });
    }
  };
};
