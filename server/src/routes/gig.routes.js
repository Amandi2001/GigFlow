import express from "express";
import {
  createGig,
  getGigs
} from "../controllers/gig.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Create Gig
 * POST /api/gigs
 * Protected
 */
router.post("/", authMiddleware, createGig);

/**
 * Get All Open Gigs + Search
 * GET /api/gigs?search=
 * Public
 */
router.get("/", getGigs);

export default router;
