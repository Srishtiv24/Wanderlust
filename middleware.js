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
  if (!req.isAuthenticated()) {//passport 
    req.session.redirectUrl = req.originalUrl;//save the url where user was trying to reach after login we can send them there 
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

/*
Session IDs and storage
Express-session behavior:
As soon as a client connects and express-session middleware runs, a session ID is created if one doesn’t already exist. This ID is sent back to the client in a cookie (usually connect.sid).
This happens even for anonymous visitors — before login or registration.
The session data (including the ID) is stored in whatever session store you configured (in-memory by default, or MongoDB if you use connect-mongo).

MongoDB storage:
If you’re using connect-mongo (or another persistent store), the session object is stored in MongoDB immediately when created, not only after login.
At first, the session may just contain minimal info (like flash messages, CSRF tokens, etc.).
After login, Passport adds the serialized user ID into the session object. That updated session is then saved back to MongoDB.
Passport’s role
Passport doesn’t create the session ID — that’s express-session.

What Passport does is attach user identity to the existing session after login.
On login: req.login() → Passport serializes the user ID into the session.
On subsequent requests: Passport deserializes the user ID from the session and populates req.user.

So to answer directly
Session ID is created as soon as the client joins (first request), regardless of login/registration.
It is stored in MongoDB immediately if you’re using a Mongo-backed session store.
Login just enriches the existing session with user identity — it doesn’t trigger the creation of the session ID itself.

“Mongo store” in the context of session‑based authentication, it usually refers to using MongoDB as the session store for express-session.
What it means
By default, express-session keeps sessions in memory. That’s fine for development, but not scalable — sessions disappear when the server restarts.

A Mongo store (via packages like connect-mongo) saves session data inside MongoDB.
Each session gets an entry in a MongoDB collection (often called sessions), keyed by the session ID stored in the user’s cookie.
How it works
User logs in → server creates a session object.
Session ID is sent back to the browser in a cookie.
connect-mongo saves the session object in MongoDB.
On each request, the browser sends the cookie → server looks up the session ID in MongoDB → retrieves the session data.

Benefits
Persistence: Sessions survive server restarts.
Scalability: Works across multiple servers if they share the same MongoDB.
Flexibility: You can query or manage sessions directly in MongoDB.
*/