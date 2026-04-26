const Listing = require("../models/listing.js");
const opencage = require('opencage-api-client');

module.exports.index = async (req, res) => {
  const { search, mood, minPrice, maxPrice, category } = req.query;
  let filter = {};

  // Text search
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [
      { title: regex },
      { description: regex },
      { location: regex },
      { country: regex }
    ];
  }

  // Mood → keyword mapping
  const moodKeywords = {
    healing:     ['spa','wellness','peaceful','retreat','calm','nature','forest','lake','mountain','cozy','serene','quiet'],
    celebration: ['luxury','party','villa','resort','beach','pool','penthouse','island','celebration'],
    solitude:    ['cabin','remote','secluded','quiet','countryside','rural','highlands','mountain','treehouse'],
    adventure:   ['mountain','trek','camp','safari','wild','hiking','ski','adventure','outdoor','chalet'],
    monsoon:     ['india','kerala','goa','coorg','tropical','rainforest','beach','bali','phuket'],
    sisterhood:  ['bali','greece','tuscany','villa','retreat','boutique','beachfront','island'],
  };

  if (mood && moodKeywords[mood]) {
    const regexes = moodKeywords[mood].map(k => new RegExp(k, 'i'));
    const moodFilter = { $or: [
      { title: { $in: regexes } }, { description: { $in: regexes } },
      { location: { $in: regexes } }, { country: { $in: regexes } }
    ]};
    filter = filter.$or ? { $and: [filter, moodFilter] } : moodFilter;
  }

  // Category filter
  const categoryKeywords = {
    mountains: ['mountain','alpine','ski','summit','highland','aspen','banff','verbier','chalet'],
    beach:     ['beach','coastal','ocean','sea','malibu','cancun','bali','phuket','miami','mykonos','beachfront'],
    arctic:    ['arctic','iceland','ski','snow','winter','chalet','verbier'],
    pools:     ['pool','villa','resort','luxury','penthouse','infinity'],
    cities:    ['city','urban','downtown','loft','apartment','tokyo','new york','miami','los angeles','boston','amsterdam'],
    camping:   ['camp','tent','outdoor','wild','safari','nature','treehouse'],
    castles:   ['castle','historic','manor','estate','brownstone','cottage','canal'],
    forests:   ['forest','tree','treehouse','jungle','woods','cabin','log'],
  };

  if (category && categoryKeywords[category]) {
    const regexes = categoryKeywords[category].map(k => new RegExp(k, 'i'));
    const catFilter = { $or: [
      { title: { $in: regexes } }, { description: { $in: regexes } },
      { location: { $in: regexes } }, { country: { $in: regexes } }
    ]};
    filter = filter.$or ? { $and: [filter, catFilter] } : catFilter;
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const allListings = await Listing.find(filter);
  res.render("listings/index.ejs", {
    allListings,
    searchQuery:     search || '',
    activeMood:      mood || '',
    activeCategory:  category || '',
    activeMinPrice:  minPrice || '',
    activeMaxPrice:  maxPrice || '',
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res, next) => {
  if (!req.file) {
    req.flash("error", 'Image upload is required.');
    return res.redirect("listings/new");
  }
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
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

async function getCoordinates(location, country) {
  try {
    const data = await opencage.geocode({ q: `${location}, ${country}`, key: process.env.OPENCAGE_API_KEY });
    if (data.status.code === 200 && data.results.length > 0) {
      return data.results[0].geometry;
    }
    return { lat: 28.644800, lng: 77.216721 };
  } catch (error) {
    return { lat: 28.644800, lng: 77.216721 };
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
  let updatedListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (req.file) {
    updatedListing.image = { url: req.file.path, filename: req.file.filename };
    await updatedListing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};