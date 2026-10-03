import express from "express";
import Product from "../models/Product.js";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// GET single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ message: "Product not found" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Create product
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, price, description, category, image, images, stock, slug, tags, compareAt, productCode, badge, sizes, colors } = req.body;
    const product = new Product({
      name: name || "Sample name",
      price: price || 0,
      compareAt: compareAt || undefined,
      description: description || "Sample description",
      category: category || "Sample category",
      image: image || "https://via.placeholder.com/300",
      images: images || [],
      productCode: productCode || "",
      badge: badge || "",
      sizes: sizes || [],
      colors: colors || [],
      stock: stock || 0,
      slug: slug || "sample-slug-" + Date.now(),
      tags: tags || []
    });
    const createdProduct = await product.save();

    // Fetch all users to notify them (in background)
    try {
      const users = await User.find({}).select("email");
      if (users.length > 0) {
        const emails = users.map((u: any) => u.email).join(",");
        const mailOptions = {
          from: process.env.EMAIL_USER,
          bcc: emails,
          subject: `✨ New Arrival at Vedhav Silvers: ${createdProduct.name} ✨`,
          text: `Hello from Vedhav Silvers!\n\nWe have just added a stunning new piece to our collection: ${createdProduct.name}.\nPrice: ₹${createdProduct.price}\n\nCheck it out now at our store!\n\nWith love,\nVedhav Silvers Atelier`
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) console.error("Error sending product newsletter:", err);
        });
      }
    } catch(err) {
      console.error("Newsletter error", err);
    }

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Update product
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const { name, price, description, image, images, category, stock, isFeatured, compareAt, productCode, badge, sizes, colors } = req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name;
      product.price = price;
      if (compareAt !== undefined) product.compareAt = compareAt;
      product.description = description;
      product.image = image;
      product.images = images || product.images;
      if (productCode !== undefined) product.productCode = productCode;
      if (badge !== undefined) product.badge = badge;
      if (sizes !== undefined) product.sizes = sizes;
      if (colors !== undefined) product.colors = colors;
      product.category = category;
      product.stock = stock;
      if (isFeatured !== undefined) product.isFeatured = isFeatured;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Admin: Delete product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product) {
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
