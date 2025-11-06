const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

//middleware func for validation of listing - Joi
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

//middleware func for validation of review - Joi
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "Login to continue !");
    return res.redirect("/login");
  }
  next();
};

const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  let listing = await Listing.findById(id);
  if (
    !(res.locals.currUser && res.locals.currUser._id.equals(listing.owner._id))
  ) {
    req.flash("error", "You are not the owner !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

const isReviewAuthor = async (req, res, next) => {
  let { id,reviewId } = req.params;
  let newReview=await Review.findById(reviewId);
  if (!(res.locals.currUser && res.locals.currUser._id.equals(newReview.author._id))) 
    {
    req.flash("error", "You are not the author of this review  !");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

module.exports = {
  validateListing,
  validateReview,
  isLoggedIn,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
};
