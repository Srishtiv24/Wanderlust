const express  = require("express");
const router   = express.Router();
const Listing  = require("../models/listing.js");

// ─────────────────────────────────────────────
// STEP 1 — Extract filters from user's message
// ─────────────────────────────────────────────
function extractFilters(message) {
  const msg = message.toLowerCase();
  const filters = {};

  // ── Budget / price ──
  // "under ₹2000", "below 1500", "less than 3000", "budget under 2000"
  const underMatch = msg.match(/(?:under|below|less than|upto|up to|cheaper than|max|budget)[^\d]*(\d+)/);
  if (underMatch) filters.maxPrice = parseInt(underMatch[1]);

  // "above ₹1000", "more than 2000", "atleast 3000"
  const overMatch = msg.match(/(?:above|over|more than|atleast|at least|minimum|min)[^\d]*(\d+)/);
  if (overMatch) filters.minPrice = parseInt(overMatch[1]);

  // ── Stay type keywords ──
  const typeMap = {
    beach:    ["beach", "coastal", "ocean", "sea", "shore", "seaside", "beachfront"],
    mountain: ["mountain", "hill", "alpine", "altitude", "peak", "highland"],
    ski:      ["ski", "skiing", "snow", "slope", "chalet", "winter sport"],
    cabin:    ["cabin", "log cabin", "wooden", "rustic", "forest", "woods"],
    treehouse:["treehouse", "tree house", "treetop", "tree top"],
    luxury:   ["luxury", "luxurious", "premium", "opulent", "penthouse", "villa"],
    budget:   ["budget", "cheap", "affordable", "cheapest", "inexpensive", "economical"],
    city:     ["city", "urban", "downtown", "apartment", "loft", "metropolitan"],
    island:   ["island", "private island", "fiji", "maldives", "tropical"],
    safari:   ["safari", "wildlife", "serengeti", "africa", "lodge"],
    historic: ["historic", "castle", "heritage", "vintage", "old", "brownstone"],
    romantic: ["romantic", "couple", "honeymoon", "anniversary", "getaway"],
    eco:      ["eco", "sustainable", "green", "environment", "nature"],
    pool:     ["pool", "infinity pool", "private pool", "swimming"],
    lake:     ["lake", "lakefront", "lakeside", "waterfront"],
  };

  filters.types = [];
  for (const [type, keywords] of Object.entries(typeMap)) {
    if (keywords.some(k => msg.includes(k))) {
      filters.types.push(type);
    }
  }

  // ── Country / region ──
  const regionMap = {
    asia:    ["asia", "asian", "japan", "bali", "indonesia", "thailand", "phuket",
              "tokyo", "maldives", "dubai", "uae", "middle east"],
    europe:  ["europe", "european", "italy", "tuscany", "florence", "amsterdam",
              "netherlands", "switzerland", "verbier", "scotland", "uk",
              "united kingdom", "cotswolds", "greece", "mykonos"],
    america: ["america", "usa", "united states", "us", "new york", "los angeles",
              "miami", "aspen", "malibu", "boston", "charleston", "montana",
              "lake tahoe", "portland", "new hampshire"],
    africa:  ["africa", "tanzania", "serengeti", "safari"],
    caribbean:["caribbean", "cancun", "mexico"],
    pacific: ["pacific", "fiji", "costa rica"],
    canada:  ["canada", "banff", "canadian"],
  };

  filters.regions = [];
  for (const [region, keywords] of Object.entries(regionMap)) {
    if (keywords.some(k => msg.includes(k))) {
      filters.regions.push(region);
    }
  }

  // ── Sort intent ──
  if (msg.match(/cheap|lowest|most affordable|budget|least expensive/)) filters.sort = "cheapest";
  if (msg.match(/expensive|luxury|most luxurious|highest|premium|top/))  filters.sort = "priciest";

  // ── "all listings" or general query ──
  if (msg.match(/all listing|every listing|show all|list all|what do you have|what listings/)) {
    filters.showAll = true;
  }

  return filters;
}

// ─────────────────────────────────────────────
// STEP 2 — Build MongoDB query from filters
// ─────────────────────────────────────────────
function buildMongoQuery(filters) {
  const query = {};

  // Price range
  if (filters.maxPrice || filters.minPrice) {
    query.price = {};
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
    if (filters.minPrice) query.price.$gte = filters.minPrice;
  }

  // Type keywords → search in title + description
  if (filters.types.length > 0) {
    const typeKeywords = {
      beach:    ["beach", "coastal", "ocean", "shore"],
      mountain: ["mountain", "alpine", "highland", "hill"],
      ski:      ["ski", "slope", "chalet"],
      cabin:    ["cabin", "rustic", "log"],
      treehouse:["treehouse", "treetop"],
      luxury:   ["luxury", "penthouse", "villa", "opulent"],
      budget:   [],   // handled by sort
      city:     ["city", "downtown", "loft", "apartment", "urban"],
      island:   ["island"],
      safari:   ["safari", "lodge"],
      historic: ["historic", "castle", "brownstone", "heritage"],
      romantic: [],   // no specific keyword — handled by sort/type combo
      eco:      ["eco"],
      pool:     ["pool"],
      lake:     ["lake", "lakefront"],
    };

    const regexTerms = filters.types
      .flatMap(t => typeKeywords[t] || [])
      .filter(Boolean);

    if (regexTerms.length > 0) {
      const regexPattern = regexTerms.join("|");
      query.$or = [
        { title:       { $regex: regexPattern, $options: "i" } },
        { description: { $regex: regexPattern, $options: "i" } },
      ];
    }
  }

  // Region → match country field
  const regionCountryMap = {
    asia:     ["Japan", "Indonesia", "Thailand", "Maldives", "United Arab Emirates"],
    europe:   ["Italy", "Netherlands", "Switzerland", "United Kingdom", "Greece"],
    america:  ["United States"],
    africa:   ["Tanzania"],
    caribbean:["Mexico"],
    pacific:  ["Fiji", "Costa Rica"],
    canada:   ["Canada"],
  };

  if (filters.regions.length > 0) {
    const countries = filters.regions.flatMap(r => regionCountryMap[r] || []);
    if (countries.length > 0) {
      // merge with existing $or if any
      const countryCondition = { country: { $in: countries } };
      if (query.$or) {
        query.$and = [{ $or: query.$or }, countryCondition];
        delete query.$or;
      } else {
        query.country = { $in: countries };
      }
    }
  }

  return query;
}

// ─────────────────────────────────────────────
// STEP 3 — Fetch relevant listings from MongoDB
// ─────────────────────────────────────────────
async function fetchRelevantListings(userMessage) {
  const filters = extractFilters(userMessage);

  // showAll or no filters at all → return everything (capped at 20)
  const hasFilters =
    filters.maxPrice || filters.minPrice ||
    filters.types.length > 0 || filters.regions.length > 0;

  let listings;

  if (filters.showAll || !hasFilters) {
    listings = await Listing.find({}, "title description price location country").lean();
  } else {
    const query = buildMongoQuery(filters);
    listings = await Listing.find(query, "title description price location country").lean();

    // Fallback: if filters returned nothing, send cheapest 8 as suggestions
    if (listings.length === 0) {
      listings = await Listing
        .find({}, "title description price location country")
        .sort({ price: 1 })
        .limit(8)
        .lean();
      filters._usedFallback = true;
    }
  }

  // Sort results if needed
  if (filters.sort === "cheapest") listings.sort((a, b) => a.price - b.price);
  if (filters.sort === "priciest") listings.sort((a, b) => b.price - a.price);

  return { listings, filters };
}

// ─────────────────────────────────────────────
// STEP 4 — Build system prompt with live data
// ─────────────────────────────────────────────
function buildSystemPrompt(listings, allStats, filters) {
  const fallbackNote = filters._usedFallback
    ? `\nNOTE: No listings exactly matched the user's filters. The listings below are shown as the closest alternatives — mention this honestly.\n`
    : "";

  return `You are a smart booking assistant for Wanderlust — an Airbnb-style vacation rental platform.

PLATFORM STATS (live from database):
- Total listings available: ${allStats.total}
- Price range: ₹${allStats.minPrice.toLocaleString("en-IN")} to ₹${allStats.maxPrice.toLocaleString("en-IN")}/night
- Countries: ${allStats.countries.join(", ")}
${fallbackNote}
RELEVANT LISTINGS FOR THIS QUERY (${listings.length} shown):
${listings.map((l, i) =>
  `${i + 1}. ${l.title}\n   Location: ${l.location}, ${l.country}\n   Price: ₹${l.price.toLocaleString("en-IN")}/night\n   About: ${l.description}`
).join("\n\n")}

STRICT RULES:
1. ONLY recommend listings shown above — never invent properties
2. Always mention exact name, location, and price when recommending
3. If something the user wants isn't available, say so and suggest the closest match from above
4. Keep responses concise — 80 to 150 words
5. Use bullet points for multiple recommendations
6. Prices are in ₹ (Indian Rupees) per night
7. You can answer general travel questions but always connect back to a Wanderlust listing`;
}

// ─────────────────────────────────────────────
// ROUTES
// ─────────────────────────────────────────────
router.get("/ai-assistant", (req, res) => {
  const autoPrompt = req.query.prompt ? req.query.prompt.trim() : "";
  res.render("ai.ejs", { autoPrompt });
});

router.post("/api/ai-chat", async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages" });
    }

    // Last user message drives the filter
    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";

    // Fetch live listings from MongoDB + all-listings stats in parallel
    const [{ listings, filters }, allListings] = await Promise.all([
      fetchRelevantListings(lastUserMsg),
      Listing.find({}, "price country").lean(),
    ]);

    const allPrices   = allListings.map(l => l.price);
    const allStats    = {
      total:    allListings.length,
      minPrice: Math.min(...allPrices),
      maxPrice: Math.max(...allPrices),
      countries: [...new Set(allListings.map(l => l.country))],
    };

    const systemPrompt = buildSystemPrompt(listings, allStats, filters);

    // Call Kilo AI
    const response = await fetch("https://api.kilo.ai/api/gateway/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.KILO_API_KEY}`,
      },
      body: JSON.stringify({
        model: "kilo-auto/free",
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Something went wrong.";

    console.log(`[AI] filtered to ${listings.length}/${allStats.total} listings | user: "${lastUserMsg.slice(0, 60)}"`);
    res.json({ reply });

  } catch (err) {
    console.error("[AI route error]", err);
    res.status(500).json({ reply: "Server error — please try again." });
  }
});

module.exports = router;