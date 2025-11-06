const express = require("express");
const router = express.Router({mergeParams:true});//since id is in app.js , so merging params so that it can be accessed here 
const wrapAsync = require("../utils/wrapAsync.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");

//create reviews 
router.post("/", 
  isLoggedIn
  ,validateReview,
  wrapAsync(reviewController.createReview
));

//delete review
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview
  ));

module.exports=router;