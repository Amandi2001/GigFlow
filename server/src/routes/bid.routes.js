import express from "express";
import {
  submitBid,
  getBidsForGig,
  hireFreelancer
} from "../controllers/bid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Submit bid
router.post("/:gigId", authMiddleware, submitBid);

// Get bids for gig
router.get("/:gigId", authMiddleware, getBidsForGig);

// 🔥 Hire freelancer
router.post("/hire/:bidId", authMiddleware, hireFreelancer);

export default router;
