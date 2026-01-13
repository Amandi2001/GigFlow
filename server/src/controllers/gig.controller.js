import Gig from "../models/Gig.js";

/**
 * CREATE GIG
 * POST /api/gigs
 * Logged-in users only
 */
export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    // basic validation
    if (!title || !description || !budget) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const gig = await Gig.create({
      title,
      description,
      budget,
      status: "open",
      createdBy: req.user.id // from auth middleware
    });

    res.status(201).json({
      message: "Gig created successfully",
      gig
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create gig",
      error: error.message
    });
  }
};

/**
 * GET GIGS
 * GET /api/gigs?search=
 * Public route
 */
export const getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await Gig.find({
      title: { $regex: search, $options: "i" },
      status: "open"
    }).populate("createdBy", "name email");

    res.status(200).json(gigs);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch gigs",
      error: error.message
    });
  }
};
