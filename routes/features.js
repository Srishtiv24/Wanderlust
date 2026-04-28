const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");

// ── GET /itinerary ────────────────────────────────────────────────────────────
router.get("/itinerary", (req, res) => res.render("itinerary.ejs"));

// ── GET /wishlist ─────────────────────────────────────────────────────────────
router.get("/wishlist", (req, res) => res.render("wishlist.ejs"));

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
      "title location country image mood category isHiddenGem estimatedCost bestSeason reviews tags"
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

// ── GET /api/tb-listings ──────────────────────────────────────────────────────
// Used by the Trip Builder on the itinerary page to populate the listing picker

router.get("/api/listings-by-ids", async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.json({ listings: [] });

    // ✅ Guard — if ids=all, return all listings (used by trip builder)
    if (ids === "all") {
      const listings = await Listing.find({}).select(
        "title location country price image description"
      );
      return res.json({ listings });
    }

    const idArr = ids
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!idArr.length) return res.json({ listings: [] });
  } catch (err) {
    console.error("tb-listings error:", err.message);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

module.exports = router;
