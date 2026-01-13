import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

// routes
import authRoutes from "./src/routes/auth.routes.js";
import gigRoutes from "./src/routes/gig.routes.js";
import bidRoutes from "./src/routes/bid.routes.js";
import hireRoutes from "./src/routes/hire.routes.js"; // ⭐ ADD THIS

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   CREATE HTTP SERVER
================================ */
const server = http.createServer(app);

/* ================================
   SOCKET.IO SETUP
================================ */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Join personal room (userId)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`👤 User joined room: ${userId}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// make io accessible inside controllers
app.set("io", io);

/* ================================
   MIDDLEWARES
================================ */
app.use(cors());
app.use(express.json());
app.use(cookieParser());

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/hire", hireRoutes); // ⭐ ADD THIS

/* ================================
   DATABASE + SERVER START
================================ */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
  });
