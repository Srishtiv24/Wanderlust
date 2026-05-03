const Listing = require("../models/listing.js");
const { vectorSearch } = require("../utils/vectorSearch.js");

// ─────────────────────────────────────────────
// STEP 1 — Extract filters from user's message
// ─────────────────────────────────────────────
function extractFilters(message) {
  const msg = message.toLowerCase();
  const filters = {};

  const underMatch = msg.match(/(?:under|below|less than|upto|up to|cheaper than|max|budget)[^\d]*(\d+)/);
  if (underMatch) filters.maxPrice = parseInt(underMatch[1]);

  const overMatch = msg.match(/(?:above|over|more than|atleast|at least|minimum|min)[^\d]*(\d+)/);
  if (overMatch) filters.minPrice = parseInt(overMatch[1]);

  const typeMap = {
    beach:     ["beach", "coastal", "ocean", "sea", "shore", "seaside", "beachfront"],
    mountain:  ["mountain", "hill", "alpine", "altitude", "peak", "highland"],
    ski:       ["ski", "skiing", "snow", "slope", "chalet", "winter sport"],
    cabin:     ["cabin", "log cabin", "wooden", "rustic", "forest", "woods"],
    treehouse: ["treehouse", "tree house", "treetop", "tree top"],
    luxury:    ["luxury", "luxurious", "premium", "opulent", "penthouse", "villa"],
    budget:    ["budget", "cheap", "affordable", "cheapest", "inexpensive", "economical"],
    city:      ["city", "urban", "downtown", "apartment", "loft", "metropolitan"],
    island:    ["island", "private island", "fiji", "maldives", "tropical"],
    safari:    ["safari", "wildlife", "serengeti", "africa", "lodge"],
    historic:  ["historic", "castle", "heritage", "vintage", "old", "brownstone"],
    romantic:  ["romantic", "couple", "honeymoon", "anniversary", "getaway"],
    eco:       ["eco", "sustainable", "green", "environment", "nature"],
    pool:      ["pool", "infinity pool", "private pool", "swimming"],
    lake:      ["lake", "lakefront", "lakeside", "waterfront"],
  };

  filters.types = [];
  for (const [type, keywords] of Object.entries(typeMap)) {
    if (keywords.some(k => msg.includes(k))) filters.types.push(type);
  }

  const regionMap = {
    asia:      ["asia", "asian", "japan", "bali", "indonesia", "thailand", "phuket",
                "tokyo", "maldives", "dubai", "uae", "middle east"],
    europe:    ["europe", "european", "italy", "tuscany", "florence", "amsterdam",
                "netherlands", "switzerland", "verbier", "scotland", "uk",
                "united kingdom", "cotswolds", "greece", "mykonos"],
    america:   ["america", "usa", "united states", "us", "new york", "los angeles",
                "miami", "aspen", "malibu", "boston", "charleston", "montana",
                "lake tahoe", "portland", "new hampshire"],
    africa:    ["africa", "tanzania", "serengeti", "safari"],
    caribbean: ["caribbean", "cancun", "mexico"],
    pacific:   ["pacific", "fiji", "costa rica"],
    canada:    ["canada", "banff", "canadian"],
  };

  filters.regions = [];
  for (const [region, keywords] of Object.entries(regionMap)) {
    if (keywords.some(k => msg.includes(k))) filters.regions.push(region);
  }

  if (msg.match(/cheap|lowest|most affordable|least expensive/)) filters.sort = "cheapest";
  if (msg.match(/expensive|luxury|most luxurious|highest|premium/)) filters.sort = "priciest";

  if (msg.match(/all listing|every listing|show all|list all|what do you have|what listings/)) {
    filters.showAll = true;
  }

  if (msg.match(/\d+.?day|itinerary|trip plan|travel plan|plan.*trip|day trip|week.*trip|solo.*trip|family.*trip|couple.*trip|morning.*afternoon|day 1|day 2|places to visit|what to do in|activities in|things to do|hidden gem|local food|packing/)) {
    filters.isItinerary = true;
  }

  return filters;
}

// ─────────────────────────────────────────────
// STEP 1b — Extract destination from message
// ─────────────────────────────────────────────
function extractDestinations(message) {
  // Remove common filler words that bleed into destination extraction
  const cleaned = message
    .replace(/\b(the|a|an|my|our|for|with|on|from|starting|next|budget|trip|travel|visit)\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  const tripTo = cleaned.match(
    /\bplan(?:ning)?\s+a(?:\s+\d+[\s-]?day)?\s+trip\s+to\s+([a-zA-Z][a-zA-Z\s]{1,30}?)(?:\s+(?:from|for|with|on|starting|next|budget)|,|\.|$)/i
  );
  if (tripTo) return [tripTo[1].trim().toLowerCase()];

  const generic = cleaned.match(
    /\b(?:trip\s+to|travel(?:ling)?\s+to|going\s+to|visiting|holiday\s+in|vacation\s+in)\s+([a-zA-Z][a-zA-Z\s]{1,30}?)(?:\s+(?:from|for|with|on|starting|next)|,|\.|$)/i
  );
  if (generic) return [generic[1].trim().toLowerCase()];

  return [];
}

// ─────────────────────────────────────────────
// STEP 2 — Fetch listings
// ─────────────────────────────────────────────
const LISTING_FIELDS = "title description price location country image _id";
const MAX_LISTINGS   = 30;

async function findExactNamedListings(userMessage) {
  const msg = userMessage.toLowerCase();
  const allTitles = await Listing.find({}, "title _id").lean();
  const matched = allTitles.filter(l => msg.includes(l.title.toLowerCase()));
  if (matched.length === 0) return [];
  matched.sort((a, b) => b.title.length - a.title.length);
  const ids = matched.map(l => l._id);
  return Listing.find({ _id: { $in: ids } }, LISTING_FIELDS).lean();
}

async function fetchRelevantListings(userMessage, explicitDestination = null) {
  const filters = extractFilters(userMessage);

  const destination = explicitDestination || extractDestinations(userMessage)[0] || null;
  filters.destinations = destination ? [destination] : [];

  const priceFilter = {};
  if (filters.maxPrice) priceFilter.$lte = filters.maxPrice;
  if (filters.minPrice) priceFilter.$gte = filters.minPrice;

  // ── 1. Exact listing name ──
  const namedListings = await findExactNamedListings(userMessage);
  if (namedListings.length > 0) {
    filters.isExactMatch = true;
    return {
      listings: namedListings.slice(0, MAX_LISTINGS),
      filters,
      searchMode: "exact",
    };
  }
// ── 2. Destination-based search ──
// ── 2. Destination-based search ──
if (destination && (filters.isItinerary || explicitDestination)) {

  const dest = destination.trim().toLowerCase();
  let destListings = [];

  // ── Same logic as tb-listings route ──
  const textResults = await Listing.find(
    { $text: { $search: dest } },
    {
      score:       { $meta: "textScore" },
      title:       1,
      description: 1,
      location:    1,
      country:     1,
      price:       1,
      image:       1,
      _id:         1,
    }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(MAX_LISTINGS)
  .lean();

  console.log(`[SEARCH] text search for "${dest}" → ${textResults.length} results`);

  if (textResults.length > 0) {
    destListings = textResults;
  } else {
    // Vector fallback
    destListings = await vectorSearch(dest, 6, priceFilter);
    console.log(`[SEARCH] vector fallback → ${destListings.length} results`);
  }

  if (destListings.length > 0) {
    filters._destMatched = true;
    return { listings: destListings.slice(0, MAX_LISTINGS), filters, searchMode: "destination" };
  }

  filters._noDestMatch = true;
  const all = await Listing.find({}, LISTING_FIELDS).lean();
  return { listings: all.slice(0, MAX_LISTINGS), filters, searchMode: "no_dest_match" };
}

  // ── 3. Price-only filter ──
  const hasPriceOnly =
    (filters.maxPrice || filters.minPrice) &&
    !filters.types.length &&
    !filters.regions.length;

  if (hasPriceOnly) {
    let listings = await Listing.find({ price: priceFilter }, LISTING_FIELDS).lean();
    if (filters.sort === "cheapest") listings.sort((a, b) => a.price - b.price);
    if (filters.sort === "priciest") listings.sort((a, b) => b.price - a.price);
    return {
      listings: listings.slice(0, MAX_LISTINGS),
      filters,
      searchMode: "price",
    };
  }

  // ── 4. Show all — capped to MAX_LISTINGS ──
  if (filters.showAll) {
    let listings = await Listing.find({}, LISTING_FIELDS).lean();
    if (filters.sort === "cheapest") listings.sort((a, b) => a.price - b.price);
    if (filters.sort === "priciest") listings.sort((a, b) => b.price - a.price);
    return {
      listings: listings.slice(0, MAX_LISTINGS),
      filters,
      searchMode: "all",
    };
  }

  // ── 5. Intent / semantic — vector search ──
  const limit = filters.isItinerary ? 5 : 8;
  let listings = await vectorSearch(userMessage, limit, priceFilter);
  if (filters.sort === "cheapest") listings.sort((a, b) => a.price - b.price);
  if (filters.sort === "priciest") listings.sort((a, b) => b.price - a.price);
  return {
    listings: listings.slice(0, MAX_LISTINGS),
    filters,
    searchMode: "vector",
  };
}

// ─────────────────────────────────────────────
// STEP 3 — Build system prompt
// ─────────────────────────────────────────────
function buildSystemPrompt(listings, allStats, filters) {
  // Global safety cap
  if (listings.length > MAX_LISTINGS) listings = listings.slice(0, MAX_LISTINGS);

  const platformContext = `WANDERLUST PLATFORM:
- ${allStats.total} listings across ${allStats.countries.length} countries
- Price range: ₹${allStats.minPrice.toLocaleString("en-IN")} to ₹${allStats.maxPrice.toLocaleString("en-IN")}/night
- Countries available: ${allStats.countries.join(", ")}`;

  const listingsLabel = filters._destMatched
    ? `WANDERLUST LISTINGS NEAR ${(filters.destinations || []).join(" / ").toUpperCase()} (${listings.length} found):`
    : `WANDERLUST LISTINGS (${listings.length} available for this query):`;

  const listingsContext = `${listingsLabel}
${listings.map((l, i) =>
  `${i + 1}. ${l.title} | ${l.location}, ${l.country} | ₹${l.price.toLocaleString("en-IN")}/night\n   ${l.description}`
).join("\n\n")}`;

  const noMatchNote = filters._noDestMatch
    ? `\nIMPORTANT: No Wanderlust properties were found in ${(filters.destinations || []).join(", ")}. Do NOT invent properties there. You may suggest listings from the list above as nearby/alternative stays, clearly labelled as such.\n`
    : "";

  // ── MODE A: Itinerary / trip planning ──
  if (filters.isItinerary || filters.isExactMatch) {
    return `You are an expert travel planner and booking assistant for Wanderlust — an Airbnb-style vacation rental platform.

${platformContext}
${noMatchNote}
${listingsContext}

YOU ARE IN ITINERARY MODE. The user wants trip planning help. Follow these rules:

ITINERARY RESPONSES:
- Write a detailed day-by-day plan with clear Morning / Afternoon / Evening sections for each day
- Suggest specific places to visit, activities, local food and restaurants for each time slot
- Include estimated costs in ₹ (Indian Rupees) for activities and meals
- Add practical travel tips (best time to go, what to carry, local transport)
- Mention 1 hidden gem or offbeat spot per day if relevant
- At the end of the itinerary, suggest the most relevant Wanderlust listing(s) from the list above as accommodation — include name, location and price
- Write as much detail as needed — do NOT cut short, do NOT limit to 150 words for itinerary responses
- Use clear formatting with bold day headers and bullet points for activities

GENERAL TRAVEL QUESTIONS (packing, weather, visa, tips):
- Answer helpfully and completely
- Connect the answer to a relevant Wanderlust listing if appropriate

WANDERLUST LISTING QUESTIONS:
- Give full details, nearby attractions, best season, and travel tips
- Suggest similar listings from the list above

RULES FOR ALL RESPONSES:
- Never invent listings — only recommend from the list above
- Always mention price in ₹/night when recommending a listing
- Be warm, helpful and conversational
- You can answer any travel-related question`;
  }

  // ── MODE B: Listing search / browse ──
  const fallbackNote = filters._usedFallback
    ? `\nNOTE: No listings exactly matched the filters. Showing closest alternatives — tell the user this.\n`
    : "";

  return `You are a smart booking assistant for Wanderlust — an Airbnb-style vacation rental platform.

${platformContext}
${fallbackNote}
${listingsContext}

YOUR JOB: Help the user find the right Wanderlust listing or answer their travel question.

FOR LISTING SEARCHES:
- Recommend relevant listings from the list above
- Always mention: listing name, location, and price (₹/night)
- Use bullet points when recommending multiple listings
- Keep responses concise — 80 to 150 words for browse/search queries
- If nothing matches exactly, say so and suggest the closest alternative

FOR GENERAL TRAVEL QUESTIONS:
- Answer helpfully even if it goes slightly beyond 150 words
- Connect the answer back to a relevant Wanderlust listing where possible

STRICT RULES:
- Never invent or hallucinate listings not in the list above
- Prices are always in ₹ (Indian Rupees) per night
- If the user seems to want an itinerary, tell them to use the Itinerary Planner at /itinerary for a better experience`;
}

// ─────────────────────────────────────────────
// Controllers
// ─────────────────────────────────────────────
module.exports.getAIAssitant = (req, res) => {
  const autoPrompt      = req.query.prompt      ? req.query.prompt.trim()      : "";
  const autoDestination = req.query.destination ? req.query.destination.trim() : "";
  res.render("features/ai.ejs", { autoPrompt, autoDestination });
};

module.exports.chatAI = async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !messages.length) {
      return res.status(400).json({ error: "No messages" });
    }

    const lastUserMsg = [...messages].reverse().find(m => m.role === "user")?.content || "";

    const rawDest = (
      req.body.destination  ||
      req.query.destination ||
      ""
    ).trim();

    const explicitDestination = rawDest
      ? rawDest.toLowerCase().replace(/,/g, " ").replace(/\s+/g, " ").trim()
      : null;

    const [{ listings, filters, searchMode }, allListings] = await Promise.all([
      fetchRelevantListings(lastUserMsg, explicitDestination),
      Listing.find({}, "price country").lean(),
    ]);

    const allPrices = allListings.map(l => l.price);
    const allStats  = {
      total:     allListings.length,
      minPrice:  Math.min(...allPrices),
      maxPrice:  Math.max(...allPrices),
      countries: [...new Set(allListings.map(l => l.country))],
    };

    const systemPrompt = buildSystemPrompt(listings, allStats, filters);

    const toCard = (l) => ({
      _id:         l._id,
      title:       l.title,
      description: l.description,
      price:       l.price,
      location:    l.location,
      country:     l.country,
      image:       l.image ?? null,
    });

    let cardListings = [];
    if (searchMode === "exact")                              cardListings = listings.slice(0, 1).map(toCard);
    else if (searchMode === "destination")                   cardListings = listings.slice(0, 3).map(toCard);
    else if (["vector", "price", "all"].includes(searchMode)) cardListings = listings.slice(0, 6).map(toCard);

    const response = await fetch("https://api.kilo.ai/api/gateway/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:  `Bearer ${process.env.KILO_API_KEY}`,
      },
      body: JSON.stringify({
        model:    "kilo-auto/free",
        stream:   false,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
      }),
    });

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Something went wrong.";

    console.log(
      `[AI] mode=${searchMode}` +
      ` | dest=${explicitDestination || "none"}` +
      ` | destMatched=${!!filters._destMatched}` +
      ` | listings=${listings.length}/${allStats.total}` +
      ` | cards=${cardListings.length}` +
      ` | "${lastUserMsg.slice(0, 60)}"`
    );

    res.json({
      reply,
      listings:    cardListings,
      isItinerary: !!(filters.isItinerary || filters.isExactMatch),
    });

  } catch (err) {
    console.error("[AI CRASH]", err);
    res.status(500).json({ reply: "Server error — please try again.", listings: [] });
  }
};

module.exports.getListing=async (req, res) => {
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
}

module.exports.getListingByIds=async (req, res) => {
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
}