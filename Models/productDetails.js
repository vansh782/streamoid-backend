const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  color: {
    type: String
  },
  size: {
    type: String
  },
  mrp: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
