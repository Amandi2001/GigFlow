import mongoose from "mongoose";
import Gig from "../models/Gig.js";
import Bid from "../models/Bid.js";

/**
 * POST /api/hire/:gigId/:bidId
 * Only gig owner can hire
 */
export const hireFreelancer = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { gigId, bidId } = req.params;
    const userId = req.user.id;

    // 1️⃣ Find gig
    const gig = await Gig.findById(gigId).session(session);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    // 2️⃣ Only owner can hire
    if (gig.createdBy.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 3️⃣ Gig must be open
    if (gig.status !== "open") {
      return res.status(400).json({ message: "Gig already closed" });
    }

    // 4️⃣ Find selected bid
    const selectedBid = await Bid.findById(bidId).session(session);
    if (!selectedBid) {
      return res.status(404).json({ message: "Bid not found" });
    }

    // 5️⃣ Update selected bid
    selectedBid.status = "hired";
    await selectedBid.save({ session });

    // 6️⃣ Reject other bids
    await Bid.updateMany(
      { gig: gigId, _id: { $ne: bidId } },
      { status: "rejected" },
      { session }
    );

    // 7️⃣ Update gig
    gig.status = "closed";
    gig.assignedTo = selectedBid.bidder;
    await gig.save({ session });

    // ✅ COMMIT TRANSACTION
    await session.commitTransaction();
    session.endSession();

    // 🔔 REAL-TIME NOTIFICATION (THIS IS THE PART YOU ASKED)
    const io = req.app.get("io");
    io.to(selectedBid.bidder.toString()).emit("hired", {
      message: `You have been hired for gig: ${gig.title}`
    });

    return res.status(200).json({
      message: "Freelancer hired successfully"
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return res.status(500).json({
      message: "Hiring failed",
      error: error.message
    });
  }
};
