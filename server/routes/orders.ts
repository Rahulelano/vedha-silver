import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
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

router.post("/", protect, async (req: any, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    if (paymentMethod === "Cash on Delivery") {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.qty }
        });
      }

      const itemsList = orderItems.map((i: any) => `- ${i.name} (Variant: ${i.variant || 'Standard'}) x ${i.qty} = ₹${i.price * i.qty}`).join("\n");
      
      // 1. Email to Admin
      const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: `New COD Order Notification - ${createdOrder._id.toString().substring(createdOrder._id.toString().length - 6).toUpperCase()}`,
        text: `You have received a new COD order from ${req.user.name} (${req.user.email}).\n\nOrder Items:\n${itemsList}\n\nTotal Amount: ₹${totalPrice}\n\nShipping To:\n${req.user.name}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.postalCode}\nIndia\n\nLog in to admin panel to view full details and dispatch.`
      };

      transporter.sendMail(adminMailOptions, (error) => {
        if (error) console.log("Admin Email error:", error);
      });

      // 2. Email to Customer (Order Receipt)
      const customerMailOptions = {
        from: process.env.EMAIL_USER,
        to: req.user.email,
        subject: `Order Confirmation #${createdOrder._id.toString().substring(createdOrder._id.toString().length - 6).toUpperCase()} - Vedhav Silvers`,
        text: `Dear ${req.user.name},\n\nThank you for your purchase via Cash on Delivery! We have successfully received your order and are currently processing it.\n\nHere is a summary of what you ordered:\n${itemsList}\n\nTotal to Pay on Delivery: ₹${totalPrice}\n\nYour order will be shipped to:\n${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}.\n\nYou will receive another update once your package has been safely dispatched from our Mylapore atelier!\nIf you have any questions, just reply to this email.\n\nWith love,\nVedhav Silvers\nChennai`
      };

      transporter.sendMail(customerMailOptions, (error) => {
        if (error) console.log("Customer receipt email error:", error);
      });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/myorders", protect, async (req: any, res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
