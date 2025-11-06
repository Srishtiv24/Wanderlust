//Model and Schema to represent a our data 

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

//model
let Listing= mongoose.model("Listing",listingSchema);
module.exports=Listing;