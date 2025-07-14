const jwt = require("jsonwebtoken");
const User = require("../models/User");
module.exports = (requireAdmin = false) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies.token;
      console.log("Token:", req.cookies.token);
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      if (requireAdmin && !user.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error("Auth error details:", err);
      res.status(401).json({ message: "Invalid token" });
    }
  };
};
