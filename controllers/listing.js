const Listing = require("../models/listing.js");
const { vectorSearch } = require("../utils/vectorSearch.js");
const { cloudinary, storage } = require("../cloudConfig.js");

// ─────────────────────────────────────────────
// Mood → natural language query for vector search
// ─────────────────────────────────────────────
const MOOD_QUERIES = {
  healing:     "peaceful wellness retreat spa nature calm serene yoga meditation quiet scenic",
  celebration: "luxury party villa resort pool rooftop glamour exclusive premium champagne",
  solitude:    "secluded remote quiet cabin wilderness off-grid hidden private rustic escape",
  adventure:   "mountain trek hiking safari jungle ski slope expedition wild rugged outdoor",
  monsoon:     "lush green rainforest backwater houseboat tropical waterfall misty jungle kerala",
  sisterhood:  "boutique villa spa rooftop scenic charming wellness pool beach island retreat",
};

// ─────────────────────────────────────────────
// Category → natural language query for vector search
// ─────────────────────────────────────────────
const CATEGORY_QUERIES = {
  mountains: "mountain alpine ski chalet peak summit highland snow trek glacier valley lodge",
  beach:     "beach coastal ocean seaside sand waves surf bay lagoon beachfront island villa",
  arctic:    "arctic igloo aurora northern lights snow ice tundra polar glacier lapland winter",
  pools:     "infinity pool private pool swimming rooftop pool resort villa overwater jacuzzi",
  cities:    "city urban downtown skyline loft apartment penthouse metropolitan vibrant neighborhood",
  camping:   "camping tent glamping campfire wilderness national park treehouse off-grid stargazing",
  castles:   "castle palace fort heritage historic royal haveli chateau manor medieval estate",
  forests:   "forest jungle treehouse canopy rainforest wildlife eco nature lush trail bamboo",
};

module.exports.index = async (req, res) => {
  const { search, mood, minPrice, maxPrice, category, allPage } = req.query;

  const priceFilter = {};
  if (minPrice) priceFilter.$gte = Number(minPrice);
  if (maxPrice) priceFilter.$lte = Number(maxPrice);

  let allListings;

  const hasQuery        = search?.trim();
  const hasVectorSignals = mood || category;

  const isLongQuery = (text = "") => {
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount > 4 || text.length > 30;
  };

  const useVector = hasVectorSignals || (hasQuery && isLongQuery(search));

  if (useVector) {
    const parts = [];
    if (search?.trim()) parts.push(search.trim());
    if (mood && MOOD_QUERIES[mood])                 parts.push(MOOD_QUERIES[mood]);
    if (category && CATEGORY_QUERIES[category])     parts.push(CATEGORY_QUERIES[category]);
    allListings = await vectorSearch(parts.join(". "), 30, priceFilter);
  } else {
    const filter = {};
    if (search?.trim()) filter.$text = { $search: search.trim() };
    if (minPrice || maxPrice) filter.price = priceFilter;
    allListings = await Listing.find(filter);
  }

  // ── Explore-All pagination (only when no filters active) ──
 // ── Explore-All pagination (only when no filters active) ──
const PAGE_SIZE      = 12;
const exploreOpen    = !!allPage;
const currentAllPage = Math.max(1, parseInt(allPage) || 1);

let exploreListings      = [];
let exploreTotalPages    = 1;
let exploreTotalListings = 0;

if (exploreOpen) {
  exploreTotalListings = await Listing.countDocuments({});
  exploreTotalPages    = Math.ceil(exploreTotalListings / PAGE_SIZE);

  const safePage  = Math.min(currentAllPage, exploreTotalPages);
  const skipCount = (safePage - 1) * PAGE_SIZE;

  exploreListings = await Listing.find({})
    .skip(skipCount)
    .limit(PAGE_SIZE)
    .lean(); 
}
  // ── AJAX / XHR response — return everything the client needs ──
  const isXhr = req.xhr || req.headers['x-requested-with'] === 'XMLHttpRequest';
  if (isXhr) {
    return res.json({
      allListings,
      searchQuery:    search    || "",
      activeMood:     mood      || "",
      activeCategory: category  || "",
      activeMinPrice: minPrice  || "",
      activeMaxPrice: maxPrice  || "",
      exploreOpen,
      exploreListings,
      exploreTotalListings,
      exploreTotalPages,
      currentAllPage: Math.min(currentAllPage, exploreTotalPages || 1),
    });
  }

  res.render("listings/index.ejs", {
    allListings,
    searchQuery:    search    || "",
    activeMood:     mood      || "",
    activeCategory: category  || "",
    activeMinPrice: minPrice  || "",
    activeMaxPrice: maxPrice  || "",
    exploreOpen,
    exploreListings,
    exploreTotalListings,
    exploreTotalPages,
    currentAllPage: Math.min(currentAllPage, exploreTotalPages || 1),
  });
};

module.exports.addToGallery=async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "You do not have permission.");
      return res.redirect(`/listings/${req.params.id}`);
    }
    if (!req.files || req.files.length === 0) {
      req.flash("error", "No files selected.");
      return res.redirect(`/listings/${req.params.id}`);
    }
    const newMedia = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
      type: f.mimetype.startsWith("video") ? "video" : "image",
    }));
    listing.gallery.push(...newMedia);
    await listing.save();
    req.flash(
      "success",
      `${newMedia.length} file${newMedia.length !== 1 ? "s" : ""} uploaded!`
    );
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error("[Gallery upload error]", err);
    req.flash("error", "Upload failed. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
}

module.exports.delFromGallery= async (req, res) => {
  // exact same handler body as your DELETE route
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Listing not found.");
      return res.redirect("/listings");
    }
    if (!listing.owner.equals(req.user._id)) {
      req.flash("error", "Permission denied.");
      return res.redirect(`/listings/${req.params.id}`);
    }
    const { filename, resourceType } = req.body;
    if (!filename) {
      req.flash("error", "No file specified.");
      return res.redirect(`/listings/${req.params.id}`);
    }
    await cloudinary.uploader.destroy(filename, {
      resource_type: resourceType === "video" ? "video" : "image",
    });
    listing.gallery = listing.gallery.filter((m) => m.filename !== filename);
    await listing.save();
    req.flash("success", "Photo deleted.");
    res.redirect(`/listings/${req.params.id}`);
  } catch (err) {
    console.error("[Gallery delete error]", err);
    req.flash("error", "Delete failed. Please try again.");
    res.redirect(`/listings/${req.params.id}`);
  }
}

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  if (!req.file) {
    req.flash("error", 'Image upload is required.');
    return res.redirect("listings/new");
  }
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url: req.file.path, filename: req.file.filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.showListing = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: 'reviews', populate: { path: "author" } })
    .populate('owner');
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  let { lat, lng } = await getCoordinates(listing.location, listing.country);
  res.render("listings/show.ejs", { listing, lat, lng });
};

// ─────────────────────────────────────────────
// Geocode using Nominatim (OpenStreetMap)
// ─────────────────────────────────────────────
async function getCoordinates(location, country) {
  try {
    const query = encodeURIComponent(`${location}, ${country}`);
    const url   = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;
    const res   = await fetch(url, {
      headers: { "User-Agent": "WanderlustApp/1.0 (srishtiiv24@gmail.com)" },
    });
    if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      return { lat: parseFloat(lat), lng: parseFloat(lon) };
    }
    return { lat: 28.6448, lng: 77.2167 };
  } catch (err) {
    console.error("[Geocode] Nominatim failed:", err.message);
    return { lat: 28.6448, lng: 77.2167 };
  }
}

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    return res.redirect("/listings");
  }
  listing.image.url = listing.image.url.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing });
};

module.exports.editListing = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  Object.assign(listing, req.body.listing);
  if (req.file) {
    listing.image = { url: req.file.path, filename: req.file.filename };
  }
  await listing.save();
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};