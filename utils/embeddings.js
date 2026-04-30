// Local embeddings — no API key, no rate limits, completely free
// Uses @xenova/transformers — run: npm install @xenova/transformers
// Model downloads ~25MB on first run and caches locally

let pipeline = null;

async function getEmbedder() {
  if (pipeline) return pipeline;

  // Dynamic import — @xenova/transformers is ESM
  const { pipeline: createPipeline } = await import("@xenova/transformers");

  console.log("[Embedding] Loading model (first run downloads ~25MB, cached after)...");
  pipeline = await createPipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2"
  );
  console.log("[Embedding] Model ready.");
  return pipeline;
}

async function generateEmbedding(text) {
  const embeder = await getEmbedder();

  const output = await embeder(text, {
    pooling:   "mean",
    normalize: true,
  });

  // output.data is a Float32Array — convert to plain JS array for MongoDB
  return Array.from(output.data);
}

async function generateListingEmbedding(listing) {
  const text = [
    listing.title,
    listing.description,
    listing.location,
    listing.country,
    `₹${listing.price} per night`,
  ].filter(Boolean).join(". ");

  return generateEmbedding(text);
}

async function generateQueryEmbedding(query) {
  return generateEmbedding(query);
}

module.exports = { generateListingEmbedding, generateQueryEmbedding };