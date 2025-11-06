const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview=async (req,res)=>
    { 
      let {id}=req.params;
      let listing=await Listing.findById(id);
      console.log(req.body.review);
      let newReview=new Review(req.body.review);
      newReview.author=req.user._id;//curr user id
       await newReview.save();
      listing.reviews.push(newReview);
      await listing.save();//- save() is a method on a Mongoose document instance.It tracks changes to the document and only updates the modified fields
      console.log( newReview);
      res.redirect(`/listings/${id}`);
    }
    
module.exports.destroyReview=async (req,res)=>
        { 
          let {id,reviewId}=req.params;
          await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});//save not used becoz we are accesing whole listing document 
          await Review.findByIdAndDelete(reviewId);
          console.log("review deleted");
          res.redirect(`/listings/${id}`);
        }

