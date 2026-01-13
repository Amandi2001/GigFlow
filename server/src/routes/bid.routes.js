import express from "express";
import {
  submitBid,
  getBidsForGig
} from "../controllers/bid.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Submit bid
 * POST /api/bids/:gigId
 * Protected
 */
router.post("/:gigId", authMiddleware, submitBid);

/**
 * Get bids for gig
 * GET /api/bids/:gigId
 * Protected (only gig owner)
 */
router.get("/:gigId", authMiddleware, getBidsForGig);

export default router;
