import express from "express";
import { hireFreelancer } from "../controllers/hire.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Hire freelancer
router.post("/:gigId/:bidId", authMiddleware, hireFreelancer);

export default router;
