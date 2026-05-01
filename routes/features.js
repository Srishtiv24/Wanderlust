const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const {getAIAssitant , chatAI} =require("../controllers/ai.js")

// ── GET /itinerary ────────────────────────────────────────────────────────────
router.get("/itinerary", (req, res) => res.render("features/itinerary.ejs"));

// ── GET /wishlist ─────────────────────────────────────────────────────────────
router.get("/wishlist", (req, res) => res.render("features/wishlist.ejs"));

// ── GET /api/listings-by-ids ──────────────────────────────────────────────────
router.get("/api/listings-by-ids", async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.json({ listings: [] });
    const idArr = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!idArr.length) return res.json({ listings: [] });

    const listings = await Listing.find({ _id: { $in: idArr } }).select(
      "title location country image mood category estimatedCost reviews tags"
    );

    const ordered = idArr
      .map((id) => listings.find((l) => l._id.toString() === id))
      .filter(Boolean);

    res.json({ listings: ordered });
  } catch (err) {
    console.error("listings-by-ids error:", err.message);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

router.get("/ai-assistant", getAIAssitant);

// ── /api/tb-listings — used by itinerary builder to show stays ──
// Accepts optional ?dest= query param for destination filtering
router.get("/api/tb-listings", async (req, res) => {
  try {
    const dest = (req.query.dest || "").trim();
    let listings;

    if (dest) {
      const destListings = await vectorSearch(dest, 6, {});
      listings = destListings.length > 0
        ? destListings
        : await Listing.find({}, LISTING_FIELDS).limit(8).lean();
    } else {
      listings = await Listing.find({}, LISTING_FIELDS).lean();
    }

    res.json({ listings });
  } catch (err) {
    console.error("[tb-listings error]", err);
    res.status(500).json({ listings: [] });
  }
});

router.post("/api/ai-chat", chatAI);

module.exports = router;
