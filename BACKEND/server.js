import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import crypto from "crypto";
import nodemailer from "nodemailer";

import authRoutes from "./routes/auth.js";
import User from "./models/User.js";
import Order from "./models/Order.js";
import MenuItem from "./models/MenuItem.js";
import Address from "./models/Address.js";

import authMiddleware from "./middleware/authMiddleware.js";
import adminMiddleware from "./middleware/AdminMiddleware.js";

import { Server } from "socket.io";
import http from "http";
import twilio from "twilio";

dotenv.config();

const app = express();


app.use(cors());
app.use(express.json());

/* ROOT */
app.get("/", (req, res) => {
  res.send("🚀 FITROVA Backend is running");
});

/* AUTH */
app.use("/api/auth", authRoutes);

/* DB */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

/* MENU */
app.get("/api/menu", async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menu" });
  }
});

/* SAVE ORDER */
app.post("/api/order", authMiddleware, async (req, res) => {
  try {

    const newOrder = new Order({
      user: req.user._id,
      items: req.body.items,
      total: req.body.total,
      customer: req.body.customer,
      paymentMethod: "COD",
      paymentStatus: "Unpaid",
      status: "Pending"
    });

    await newOrder.save();
    const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
/*============= customer deatail =========== */
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: req.body.customer.email,
  subject: "FITVORA Order Confirmation",
  html: `
  <h2>Hi ${req.body.customer.firstName}</h2>

  <p>Your order has been confirmed.</p>

  <p>Total Amount: ₹${req.body.total}</p>

  <p>Status: Pending</p>

  <p>Thanks for ordering from FITVORA 💪</p>
  `
});
/*====== admin email ========*/
await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: "fitvora4@gmail.com",
  subject: "New Order Received",
  html: `
  <h2>New Order Received</h2>

  <p>Name: ${req.body.customer.firstName}</p>
  <p>Phone: ${req.body.customer.phone}</p>
  <p>Total: ₹${req.body.total}</p>
  `
});
     await client.messages.create({
  from: process.env.TWILIO_WHATSAPP_NUMBER,
  to: `whatsapp:${req.body.customer.phone}`,
  body: `🔥 Hi ${req.body.customer.firstName},

Your FITVORA order is confirmed!

💪 Total: ₹${req.body.total}
🚚 Status: Pending
⏳ Estimated: 45-60 mins

Track your order in the app.`
});
    // 🔥 SEND SMS
    await client.messages.create({
      body: `Hi ${req.body.customer.firstName}, 
Your FITVORA order is confirmed! 
Total: ₹${req.body.total}`,
      from: process.env.TWILIO_PHONE,
      to: req.body.customer.phone
    });

    res.json({ message: "Order Placed Successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Order failed" });
  }
});

/* USER ORDERS */
app.get("/api/orders", authMiddleware, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
  const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

await transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: req.body.customer.email,
  subject: "FITVORA Order Confirmation",
  html: `
  <h2>Hi ${req.body.customer.firstName}</h2>

  <p>Your order has been confirmed.</p>

  <p><b>Total:</b> ₹${req.body.total}</p>

  <p>Status: Pending</p>

  <p>Thanks for ordering from FITVORA 💪</p>
  `
});

});

/* PAYMENT VERIFY */
app.post("/api/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      customer,
      total
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      const newOrder = new Order({
        customer,
        items: cart,
        total,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        status: "Paid"
      });

      await newOrder.save();
      res.json({ success: true });

    } else {
      res.status(400).json({ success: false });
    }

  } catch (error) {
    res.status(500).json({ error: "Payment verification failed" });
  }
});

/* CONTACT */
app.post("/send-message", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: "fitvora@gmail.com",
      subject: "New Contact Message",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    });

    res.json({ success: true });

  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

/* ADMIN ORDERS */
app.get("/api/admin/orders",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    const orders = await Order.find().populate("user", "name email");
    res.json(orders);
});

/* SAVE ADDRESS */
app.post("/api/address", authMiddleware, async (req, res) => {
  const newAddress = new Address({
    ...req.body,
    user: req.user._id
  });

  await newAddress.save();
  res.json({ message: "Address saved" });
});

/* UPDATE ORDER STATUS */
app.put("/api/admin/order/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const order = await Order.findById(req.params.id);
    order.status = req.body.status;
    await order.save();
    io.emit("orderUpdated", order);
    res.json({ message: "Order status updated" });
});

/* TWILIO CLIENT */
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

/* HTTP SERVER */
const server = http.createServer(app);

/* SOCKET.IO */
const io = new Server(server, {
  cors: { origin: "*" }
});

/* START SERVER */
const PORT = 5000;

server.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

