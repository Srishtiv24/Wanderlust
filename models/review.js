const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    max: 5,
    min: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  // Media attachments added by reviewer
  media: [
    {
      url: String,
      filename: String,
      type: { type: String, enum: ["image", "video"], default: "image" },
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
