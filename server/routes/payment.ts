import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import { protect } from "../middleware/auth.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/create-order", protect, async (req, res) => {
  try {
    const { amount, receipt } = req.body;
    
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_TjUBzybYxJxO1T",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "w9eAt8W3c51Dj0XUfovtGcoO",
    });

    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: receipt || `receipt_${Date.now()}`
    };

    const order = await instance.orders.create(options);
    if (!order) return res.status(500).send("Some error occured");
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      order_id
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "w9eAt8W3c51Dj0XUfovtGcoO")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful
      // Update Mongo Order Status
      const mongoOrder = await Order.findById(order_id);
      if (mongoOrder) {
        mongoOrder.isPaid = true;
        mongoOrder.paidAt = new Date();
        await mongoOrder.save();
        
        const userRequest = req as any;
        const user = await User.findById(userRequest.user.id || userRequest.user._id);

        for (const item of (mongoOrder as any).orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty }
          });
        }

        const itemsList = (mongoOrder as any).orderItems.map((i: any) => `- ${i.name} (Variant: ${i.variant || 'Standard'}) x ${i.qty} = ₹${i.price * i.qty}`).join("\n");
        const shippingAddress = (mongoOrder as any).shippingAddress;

        // Email to Admin
        const adminMailOptions = {
          from: process.env.EMAIL_USER,
          to: process.env.EMAIL_USER,
          subject: `New ONLINE PAID Order - ${mongoOrder._id.toString().substring(mongoOrder._id.toString().length - 6).toUpperCase()}`,
          text: `You have received a new ONLINE PAID order from ${user?.name} (${user?.email}).\n\nOrder Items:\n${itemsList}\n\nTotal Paid: ₹${mongoOrder.totalPrice}\n\nShipping To:\n${user?.name}\n${shippingAddress.address}\n${shippingAddress.city}, ${shippingAddress.postalCode}\nIndia\n\nLog in to admin to dispatch.`
        };
        transporter.sendMail(adminMailOptions, (err) => { if (err) console.log(err); });

        // Email to Customer
        const customerMailOptions = {
          from: process.env.EMAIL_USER,
          to: user?.email,
          subject: `Order Payment Successful #${mongoOrder._id.toString().substring(mongoOrder._id.toString().length - 6).toUpperCase()} - Vedhav Silvers`,
          text: `Dear ${user?.name},\n\nWe successfully received your online payment! Your order summary:\n${itemsList}\n\nTotal Paid: ₹${mongoOrder.totalPrice}\n\nShipping to: ${shippingAddress.address}, ${shippingAddress.city}.\n\nWith love,\nVedhav Silvers`
        };
        transporter.sendMail(customerMailOptions, (err) => { if (err) console.log(err); });
      }
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

export default router;
