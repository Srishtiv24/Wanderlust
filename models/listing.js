//Model and Schema to represent  our data 

const mongoose=require("mongoose");
const {Schema}=mongoose;
const Review = require("./review");

//schema
const listingSchema=new Schema(
    {
      title:{
       type:String,
       required:true
      },
      description:String,
      image: {
            type:{
              url:String,
              filename:String
            }
      },    
      price:Number,
      location:String,
      country:String,
      reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
      }],
      owner: {
        type:Schema.Types.ObjectId,
        ref:"User"
      }
    }
);

listingSchema.post("findOneAndDelete",async(listing)=>
{ if(listing && listing.reviews.length)
 { await Review.deleteMany({_id:{$in:listing.reviews}});}
});
//is a Mongoose middleware hook — specifically a post hook that runs after a findOneAndDelete operation on your Listing model.

//model
let Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;

/*
cascade delete pattern:
Without it, if you delete a listing, the reviews linked to that listing would remain in the database, becoming “orphaned” documents.
With this hook, you ensure data integrity: deleting a listing also cleans up its related reviews.

Key points about post middleware
post("findOneAndDelete") runs after the deletion is complete.
You get access to the deleted document (listing).
If you used pre("findOneAndDelete"), you’d get the query object instead, not the deleted doc.
Summary:  
This is a custom Mongoose middleware that automatically deletes all reviews linked to a listing once that listing is removed. It’s a neat way to enforce referential integrity in MongoDB, since MongoDB itself doesn’t have built-in cascade deletes like SQL.
*/