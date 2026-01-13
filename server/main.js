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
import hireRoutes from "./src/routes/hire.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ================================
   CORS CONFIG
================================ */
app.use(cors({
  origin: "http://localhost:5174", // frontend
  credentials: true,               // allow cookies
  methods: ["GET", "POST", "PATCH", "DELETE"]
}));

/* ================================
   MIDDLEWARES
================================ */
app.use(express.json());
app.use(cookieParser());

/* ================================
   ROUTES
================================ */
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);
app.use("/api/hire", hireRoutes);

/* ================================
   SOCKET.IO
================================ */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);
  socket.on("join", (userId) => socket.join(userId));
  socket.on("disconnect", () => console.log("❌ User disconnected:", socket.id));
});
app.set("io", io);

/* ================================
   DATABASE + SERVER
================================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch(err => console.error("❌ MongoDB connection failed:", err));
