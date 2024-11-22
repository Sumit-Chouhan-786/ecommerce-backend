const express = require("express");
const router = express.Router();
const { addProduct, getProducts } = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware"); // Import the correct upload middleware

// Route to add a product (Admin only)
router.post("/add", upload.single("image"), async (req, res) => {
  // Check if the user is authenticated and has admin privileges
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  // Call the controller function to add the product
  await addProduct(req, res);
});

// Route to get all products (accessible to everyone)
router.get("/", async (req, res) => {
  try {
    await getProducts(req, res);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch products", message: err.message });
  }
});

module.exports = router;
