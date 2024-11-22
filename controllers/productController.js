const Product = require("../models/productModel");

// Add a product (Admin only)
exports.addProduct = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" });
    }

    const { name, price, description } = req.body;

    // Ensure required fields are present
    if (!name || !price || !description) {
      return res
        .status(400)
        .json({ message: "Name, price, and description are required" });
    }

    // Save product with image path
    const product = await Product.create({
      name,
      price,
      description,
      image: req.file.path, // Store the image path in the DB
    });

    res.status(201).json({
      message: "Product added successfully",
      product: {
        _id: product._id,
        name: product.name,
        price: product.price,
        description: product.description,
        image: req.file.path, // Include image path in the response
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error adding product", message: err.message });
  }
};


// Get all products (accessible to everyone)
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    res.status(200).json({ products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while retrieving products" });
  }
};

// Get a single product (optional, for product details page)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while retrieving product" });
  }
};

// Update product (Admin only)
exports.updateProduct = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Ensure the product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product details
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while updating product" });
  }
};

// Delete product (Admin only)
exports.deleteProduct = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Ensure the product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete the product
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while deleting product" });
  }
};
