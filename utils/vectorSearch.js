const Listing = require("../models/listing.js");
const { generateQueryEmbedding } = require("./embeddings.js");

const LISTING_FIELDS = "title description price location country image _id";

async function vectorSearch(query, limit = 10, priceFilter = {}) {
  try {
    const queryEmbedding = await generateQueryEmbedding(query);

    const pipeline = [
      {
        $vectorSearch: {
          index: "listing_vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: limit,
        },
      },
      {
        $addFields: {
          vectorScore: { $meta: "vectorSearchScore" },
        },
      },
    ];

    // Apply price filter after vector search
    if (priceFilter.$lte || priceFilter.$gte) {
      const match = {};
      if (priceFilter.$lte) match.$lte = priceFilter.$lte;
      if (priceFilter.$gte) match.$gte = priceFilter.$gte;
      pipeline.push({ $match: { price: match } });
    }

    pipeline.push({
      $project: {
        title: 1, description: 1, price: 1,
        location: 1, country: 1, image: 1, vectorScore: 1,
      },
    });

    return await Listing.aggregate(pipeline);

  } catch (err) {
    console.warn("[VectorSearch] Failed, falling back:", err.message);
    // Fallback to plain regex if vector index isn't ready
    return await Listing.find({}, LISTING_FIELDS).limit(limit).lean();
  }
}

module.exports = { vectorSearch };