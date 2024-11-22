const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");

// Middleware to authenticate admin
exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Get token from header

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Unauthorized." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the user exists and is an admin
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Attach admin to the request object
    req.user = { id: admin._id, role: "admin" };
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token." });
  }
};
