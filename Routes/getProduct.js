const express = require("express");
const router = express.Router();
const Product = require("../Models/productDetails");

router.get("/products", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Product.find().skip(skip).limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      products
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/products/search", async (req, res) => {
  try {
    const { brand, color, minPrice, maxPrice } = req.query;

    const filter = {};
    if (brand) filter.brand = brand;
    if (color) filter.color = color;
    if (minPrice || maxPrice) filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);

    const products = await Product.find(filter);

    res.status(200).json({
      total: products.length,
      products
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
