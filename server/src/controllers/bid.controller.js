import mongoose from "mongoose";
import Bid from "../models/Bid.js";
import Gig from "../models/Gig.js";

/**
 * 🔹 SUBMIT BID
 * POST /api/bids/:gigId
 */
export const submitBid = async (req, res) => {
  try {
    const { amount, message } = req.body;
    const gigId = req.params.gigId;
    const userId = req.user.id;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // Cannot bid on own gig
    if (gig.createdBy.toString() === userId) {
      return res.status(403).json({
        message: "You cannot bid on your own gig"
      });
    }

    // Only open gigs
    if (gig.status !== "open") {
      return res.status(400).json({
        message: "Bidding is closed for this gig"
      });
    }

    const bid = await Bid.create({
      gig: gigId,
      bidder: userId,
      amount,
      message
    });

    res.status(201).json({
      message: "Bid submitted successfully",
      bid
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to submit bid",
      error: error.message
    });
  }
};

/**
 * 🔹 GET BIDS FOR A GIG
 * GET /api/bids/:gigId
 */
export const getBidsForGig = async (req, res) => {
  try {
    const gigId = req.params.gigId;
    const userId = req.user.id;

    const gig = await Gig.findById(gigId);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    if (gig.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const bids = await Bid.find({ gig: gigId })
      .populate("bidder", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bids",
      error: error.message
    });
  }
};

/**
 * 🔥 PHASE 6: HIRE FREELANCER (TRANSACTION)
 * POST /api/bids/:bidId/hire
 */
export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { bidId } = req.params;
    const userId = req.user.id;

    const bid = await Bid.findById(bidId).session(session);
    if (!bid) throw new Error("Bid not found");

    const gig = await Gig.findById(bid.gig).session(session);
    if (!gig) throw new Error("Gig not found");

    // Only gig owner
    if (gig.createdBy.toString() !== userId) {
      throw new Error("Not authorized");
    }

    // Only open gig
    if (gig.status !== "open") {
      throw new Error("Gig already assigned");
    }

    // Hire selected bid
    bid.status = "hired";
    await bid.save({ session });

    // Reject others
    await Bid.updateMany(
      { gig: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" },
      { session }
    );

    // Update gig
    gig.status = "assigned";
    gig.hiredBid = bid._id;
    await gig.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      message: "Freelancer hired successfully 🎉"
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    res.status(400).json({
      message: error.message
    });
  }
};
