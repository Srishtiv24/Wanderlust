const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { getAIAssitant, chatAI } = require("../controllers/ai.js");

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

router.post("/api/ai-chat", chatAI);

// ── /api/tb-listings — used by itinerary builder to show stays ──
// Accepts optional ?dest= query param for destination filtering
router.get("/api/tb-listings", async (req, res) => {
  try {
    const dest = (req.query.dest || "").trim().toLowerCase();
    let listings = [];

    if (dest) {
      // 1. TEXT SEARCH (fast + indexed)
      const textResults = await Listing.find(
        { $text: { $search: dest } },
        {
          score: { $meta: "textScore" },
          title: 1,
          location: 1,
          country: 1,
          price: 1,
          image: 1,
        }
      )
        .sort({ score: { $meta: "textScore" } })
        .limit(20)
        .lean();

      if (textResults.length > 0) {
        listings = textResults;
      } else {
        // 2. VECTOR SEARCH (semantic fallback)
        const vectorResults = await vectorSearch(dest, 20, {});
        listings = vectorResults || [];
      }
    } else {
      //No destination → return empty (your design choice)
      listings = [];
    }
    res.json({ listings });
  } catch (err) {
    console.error("[tb-listings error]", err);
    res.status(500).json({ listings: [] });
  }
});

module.exports = router;
