const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const multer = require("multer");
const Product = require("../Models/productDetails");

const uploadPath = path.join(__dirname, "../Uploads");

const upload = multer({ dest: uploadPath });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const validProducts = [];
    const invalidProducts = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const { sku, name, brand, color, size, mrp, price, quantity } = row;

        const mrpNum = Number(mrp);
        const priceNum = Number(price);
        const qtyNum = Number(quantity);

        if (!sku || !name || !brand || !mrp || !price) {
          invalidProducts.push({ ...row, reason: "Missing required field(s)" });
        } else if (isNaN(mrpNum) || isNaN(priceNum) || isNaN(qtyNum)) {
          invalidProducts.push({ ...row, reason: "Invalid numeric value" });
        } else if (priceNum > mrpNum) {
          invalidProducts.push({ ...row, reason: "Price cannot be greater than MRP" });
        } else if (qtyNum < 0) {
          invalidProducts.push({ ...row, reason: "Quantity cannot be negative" });
        } else {
          validProducts.push({
            sku,
            name,
            brand,
            color,
            size,
            mrp: mrpNum,
            price: priceNum,
            quantity: qtyNum
          });
        }
      })
      .on("end", async () => {
        try {
          if (validProducts.length > 0) {
            await Product.insertMany(validProducts);
          }
          fs.unlinkSync(filePath);
          res.status(200).json({
            message: "File processed successfully",
            totalRows: validProducts.length + invalidProducts.length,
            validCount: validProducts.length,
            invalidCount: invalidProducts.length,
            invalidData: invalidProducts
          });
        } catch (err) {
          console.error("Error saving to DB:", err);
          res.status(500).json({ error: "Database save error" });
        }
      })
      .on("error", (err) => {
        console.error("CSV Parsing Error:", err);
        res.status(500).json({ error: "Error parsing CSV file" });
      });
  } catch (error) {
    console.error("Error in Parsing:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
