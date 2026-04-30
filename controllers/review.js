const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  // Attach uploaded media files if any
  if (req.files && req.files.length > 0) {
    newReview.media = req.files.map((f) => ({
      url: f.path,
      filename: f.filename,
      type: f.mimetype.startsWith("video") ? "video" : "image",
    }));
  }

  await newReview.save();
  listing.reviews.push(newReview);
  await listing.save();
  req.flash("success", "Review added!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted.");
  res.redirect(`/listings/${id}`);
};
