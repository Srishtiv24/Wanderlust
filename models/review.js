const mongoose=require("mongoose");
const {Schema}=mongoose;

const reviewSchema=new Schema(
    {   
        comment:String,
        rating:{
            type:Number,
            max:5,
            min:1
        },
        createdAt:{  
            type:Date,
            default:Date.now
        },
        author:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    }
);
const Review=mongoose.model("Review",reviewSchema);
module.exports=Review;