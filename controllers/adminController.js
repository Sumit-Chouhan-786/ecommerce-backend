const Admin = require("../models/adminModel");
const bcrypt = require("bcrypt");

// Admin signup
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const admin = await Admin.create({ name, email, password });
    res.status(201).json({ message: "Admin registered successfully", admin });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if admin exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Check if password matches
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Send success response
    res.status(200).json({ message: "Login successful", adminId: admin._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

