require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const Listing  = require("../models/listing.js");
const initData = require("./data.js");

main()
  .then(() => {
    console.log("Connected to database!");
    initDB();
  })
  .catch(() => console.log("Unable to connect to database"));

async function main() {
  await mongoose.connect(process.env.ATLAS_DB_URL);
}

async function ensureVectorIndex() {
  try {
    const collection = mongoose.connection.collection("listings");

    const existing = await collection.listSearchIndexes().toArray();
    const already  = existing.some(idx => idx.name === "listing_vector_index");

    if (already) {
      // Drop and recreate in case dimensions changed
      await collection.dropSearchIndex("listing_vector_index");
      console.log("Dropped old vector index — recreating...");
      await new Promise(r => setTimeout(r, 3000));
    }

    await collection.createSearchIndex({
      name: "listing_vector_index",
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type:          "vector",
            path:          "embedding",
            numDimensions: 384,   // all-MiniLM-L6-v2 produces 384 dimensions
            similarity:    "cosine",
          },
        ],
      },
    });

    console.log("✓ Vector search index created (384 dims). Wait ~1–2 min for Atlas to activate it.");
  } catch (err) {
    console.warn("[VectorIndex] Could not create index:", err.message);
  }
}

async function initDB() {
  await Listing.deleteMany({});
  console.log("Cleared existing listings.");

  await ensureVectorIndex();

  const docs = initData.data.map(obj => ({
    ...obj,
    owner: "690be7b9ddbcf4ce7cc563b9",
  }));

  console.log(`Inserting ${docs.length} listings with embeddings...`);

  for (const doc of docs) {
    try {
      const listing = new Listing(doc);
      await listing.save();
      console.log(`✓ ${listing.title}`);
      await new Promise(r => setTimeout(r, 600)); // avoid HF rate limit
    } catch (err) {
      console.error(`✗ ${doc.title}:`, err.message);
    }
  }

  console.log("Done! All listings inserted with embeddings.");
  process.exit(0);
}