import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    budget: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: ["open", "assigned", "closed"],
      default: "open"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // 🔹 NEW (track hired bid)
    hiredBid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bid"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Gig", gigSchema);
