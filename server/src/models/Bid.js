import mongoose from "mongoose";

const bidSchema = new mongoose.Schema(
  {
    gig: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gig",
      required: true
    },

    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    amount: {
      type: Number,
      required: true
    },

    message: {
      type: String
    }
  },
  { timestamps: true }
);

// Optional bonus: one bid per gig per user
bidSchema.index({ gig: 1, bidder: 1 }, { unique: true });

export default mongoose.model("Bid", bidSchema);
