const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const { getAIAssitant, chatAI ,getListing ,getListingByIds } = require("../controllers/features.js");

// ── GET /itinerary ────────────────────────────────────────────────────────────
router.get("/itinerary", (req, res) => res.render("features/itinerary.ejs"));

// ── GET /wishlist ─────────────────────────────────────────────────────────────
router.get("/wishlist", (req, res) => res.render("features/wishlist.ejs"));

// ── GET /api/listings-by-ids ──────────────────────────────────────────────────
router.get("/api/listings-by-ids", getListingByIds);

router.get("/ai-assistant", getAIAssitant);

router.post("/api/ai-chat", chatAI);

// ── /api/tb-listings — used by itinerary builder to show stays ──
// Accepts optional ?dest= query param for destination filtering
router.get("/api/tb-listings",getListing );

module.exports = router;
