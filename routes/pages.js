const express = require("express");
const router  = express.Router();
const Listing = require("../models/listing.js");

const MOODS = {
  peaceful:    { label:"Peaceful",      emoji:"☁️",  tagline:"Slow down. Breathe. Be.",       color:"#2d7a6b", bg:"linear-gradient(135deg,#e8f5f2,#c5ebe3)", border:"#4caf9a", keywords:["calm","serene","lake","nature","forest","quiet","retreat"] },
  adventurous: { label:"Adventurous",   emoji:"🧗",  tagline:"Push your limits.",             color:"#d4820f", bg:"linear-gradient(135deg,#fff7ed,#ffe0b2)", border:"#f59e42", keywords:["trek","adventure","camping","mountain","river","rafting","wild"] },
  social:      { label:"Social",        emoji:"🎊",  tagline:"Better together.",              color:"#7b2d8b", bg:"linear-gradient(135deg,#f3e5f5,#e1bee7)", border:"#9c27b0", keywords:["festival","group","market","city","community","friends"] },
  romantic:    { label:"Romantic",      emoji:"💑",  tagline:"Just the two of you.",          color:"#c25580", bg:"linear-gradient(135deg,#fdeef4,#f9c8dc)", border:"#e478a0", keywords:["romantic","couple","sunset","private","scenic","beach"] },
  cultural:    { label:"Cultural",      emoji:"🏛️",  tagline:"Discover living history.",      color:"#5c4fd4", bg:"linear-gradient(135deg,#f0eeff,#dcd5ff)", border:"#7c6af5", keywords:["heritage","fort","temple","museum","palace","art","history"] },
  healing:     { label:"Healing",       emoji:"🌿",  tagline:"Rest, renew, restore.",         color:"#1976d2", bg:"linear-gradient(135deg,#e3f2fd,#bbdefb)", border:"#42a5f5", keywords:["wellness","spa","yoga","meditation","ashram","detox","retreat"] },
  spiritual:   { label:"Spiritual",     emoji:"🕌",  tagline:"Find your inner compass.",      color:"#b5590a", bg:"linear-gradient(135deg,#fef3e2,#fde0b0)", border:"#f59e0b", keywords:["temple","sacred","pilgrimage","monastery","divine","spiritual"] },
  monsoon:     { label:"Monsoon Magic", emoji:"🌧️",  tagline:"Dance in the rain.",            color:"#1a6b3c", bg:"linear-gradient(135deg,#e8f5e9,#c8e6c9)", border:"#4caf50", keywords:["waterfall","green","misty","valley","coorg","kerala","hills"] },
};

// ── GET /mood ─────────────────────────────────────────────────────────────────
router.get("/mood", async (req, res) => {
  const { mood } = req.query;
  let listings = [], searchedMood = null;
  if (mood && MOODS[mood]) {
    searchedMood = MOODS[mood];
    const regex  = [mood, ...MOODS[mood].keywords].join("|");
    listings = await Listing.find({
      $or: [
        { mood:        { $in: [mood] } },
        { title:       { $regex: regex, $options: "i" } },
        { description: { $regex: regex, $options: "i" } },
        { location:    { $regex: regex, $options: "i" } },
      ],
    });
    if (!listings.length) listings = await Listing.find().limit(8).sort({ createdAt: -1 });
  }
  res.render("pages/mood.ejs", { MOODS, currentMood: mood || "", searchedMood, listings });
});

// ── GET /itinerary ────────────────────────────────────────────────────────────
router.get("/itinerary", (req, res) => res.render("itinerary.ejs"));

// ── GET /wishlist ─────────────────────────────────────────────────────────────
router.get("/wishlist", (req, res) => res.render("wishlist.ejs"));

// ── GET /api/listings-by-ids ──────────────────────────────────────────────────
// Called by the wishlist page to hydrate saved listing cards from localStorage IDs
router.get("/api/listings-by-ids", async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.json({ listings: [] });
    const idArr = ids.split(",").map(s => s.trim()).filter(Boolean);
    if (!idArr.length) return res.json({ listings: [] });

    const listings = await Listing.find({ _id: { $in: idArr } })
      .select("title location country image mood category isHiddenGem estimatedCost bestSeason reviews tags");

    // Preserve the user's saved order
    const ordered = idArr
      .map(id => listings.find(l => l._id.toString() === id))
      .filter(Boolean);

    res.json({ listings: ordered });
  } catch (err) {
    console.error("listings-by-ids error:", err.message);
    res.status(500).json({ error: "Failed to fetch listings." });
  }
});

// NOTE: /api/itinerary is now handled by ai.js — requests are redirected to the AI assistant.

module.exports = router;