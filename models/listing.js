const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { generateListingEmbedding } = require("../utils/embeddings.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  // Additional photos/videos added by host
  gallery: [
    {
      url: String,
      filename: String,
      type: { type: String, enum: ["image", "video"], default: "image" },
    },
  ],
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  embedding:   { type: [Number], default: undefined, select: false }

});


listingSchema.index(
  {
    title: "text",
    description: "text",
    location: "text",
    country: "text"
  },
  {
    weights: {
      title: 5,
      location: 3,
      description: 2,
      country: 1
    }
  }
);

listingSchema.pre("save", async function(next) {
  const changed = this.isNew ||
    this.isModified("title") ||
    this.isModified("description") ||
    this.isModified("location") ||
    this.isModified("country") ||
    this.isModified("price");

  if (!changed) return next();

  try {
    this.embedding = await generateListingEmbedding(this);
  } catch (err) {
    console.warn("[Embedding] Skipped:", err.message);
    // Don't block the save if embedding fails
  }
  next();
});

// Delete associated reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
