import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

/**
 * 🔹 SUBMIT BID
 * POST /api/bids/:gigId
 * Rules:
 * - Cannot bid on own gig
 * - One bid per user per gig
 */
export const submitBid = async (req, res) => {
  try {
    const { amount, message } = req.body;
    const gigId = req.params.gigId;
    const userId = req.user.id; // from auth middleware

    // 1️⃣ Check if the gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 2️⃣ Prevent bidding on own gig
    if (gig.createdBy.toString() === userId) {
      return res.status(403).json({
        message: "You cannot bid on your own gig"
      });
    }

    // 3️⃣ Optional: One bid per gig per user
    const existingBid = await Bid.findOne({
      gig: gigId,
      bidder: userId
    });
    if (existingBid) {
      return res.status(400).json({
        message: "You have already placed a bid on this gig"
      });
    }

    // 4️⃣ Create the bid
    const bid = await Bid.create({
      gig: gigId,
      bidder: userId,
      amount,
      message
    });

    return res.status(201).json({
      message: "Bid submitted successfully",
      bid
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to submit bid",
      error: error.message
    });
  }
};

/**
 * 🔹 GET BIDS FOR A GIG
 * GET /api/bids/:gigId
 * Rules:
 * - Only gig owner can view bids
 */
export const getBidsForGig = async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const userId = req.user.id; // from auth middleware

    // 1️⃣ Check if the gig exists
    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 2️⃣ Only gig owner can view bids
    if (gig.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 3️⃣ Fetch bids and include bidder info
    const bids = await Bid.find({ gig: gigId })
      .populate("bidder", "name email") // only name & email of bidder
      .sort({ createdAt: -1 }); // newest first

    return res.status(200).json(bids);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch bids",
      error: error.message
    });
  }
};
