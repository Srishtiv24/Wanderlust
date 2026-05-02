🔍 Hybrid Search & Filtering Architecture
🚀 Overview

This project implements a hybrid search system that combines:

🧠 Vector Search (Semantic Search) for understanding user intent
🏷️ MongoDB Filtering for structured constraints
⚡ Fallback Logic for efficient default queries

This approach enables intent-based discovery instead of simple keyword matching, similar to modern platforms like Airbnb.

🧠 Core Principle

Vector search determines what is relevant, while MongoDB ensures what constraints are satisfied.

🔄 Architecture Flow
User Input
   │
   ├── search (raw text)
   ├── mood (expanded)
   ├── category (expanded)
   ├── price filters
   │
   ▼
Query Builder
   │
   ├── Combine into one semantic query
   │
   ▼
Vector Search (Embeddings)
   │
   ├── Semantic similarity
   ├── Relevance ranking
   │
   ▼
MongoDB Filtering
   │
   ├── Price constraints
   │
   ▼
Final Results
⚙️ How It Works
🔎 1. Search (Free Text)
User input is used directly
No manual expansion
Sent to vector search

Example:

"Goa villa"
🎭 2. Mood (Query Expansion)
Mood is mapped to a rich descriptive query

Example:

healing →
"peaceful wellness retreat spa nature calm serene yoga meditation"

👉 This is semantic expansion, not simple keyword matching.

🏝️ 3. Category (Query Expansion)
Categories are also expanded into contextual descriptions

Example:

beach →
"coastal ocean seaside sand waves"
🔀 4. Query Fusion
All inputs are merged into a single semantic query

Example:

"Goa. peaceful wellness retreat... beach coastal ocean..."
🧠 5. Vector Search
Converts query → embedding vector
Compares with stored listing embeddings
Uses cosine similarity
Returns ranked results based on relevance
💰 6. Price Filtering (MongoDB)
Applied after vector search
Efficient for structured numeric constraints
price: { $gte: minPrice, $lte: maxPrice }
⚡ 7. Fallback Logic
If no search, mood, or category is provided:
Listing.find(filter)

👉 Uses MongoDB only (fast and cost-efficient)

🔥 Why Vector Search Instead of MongoDB?
❌ MongoDB (Keyword-Based Search)
Depends on exact word matching
Cannot understand meaning or intent
Poor handling of synonyms and natural language
✅ Vector Search (Semantic Search)
Understands context and intent
Handles synonyms and vague queries
Provides better ranking of results
💡 Example

User Query:

"romantic ocean stay"
Approach	Result
MongoDB	Weak match (keyword dependent)
Vector Search	Strong match (understands intent)
🧩 Key Concepts
Concept	Description
Query Expansion	Mood & category → descriptive queries
Query Fusion	Combine all inputs into one query
Semantic Search	Meaning-based retrieval
Ranking	Cosine similarity
Hybrid Filtering	Vector + MongoDB
⚠️ Current Limitation
Query expansion is hardcoded
Limited adaptability to new or complex queries
🚀 Future Improvements
🧠 AI-based query expansion (LLM)
⭐ Hybrid ranking (vector + price + rating)
📍 Location-aware search
⚡ Caching (Redis)
🎯 Personalized recommendations
🧾 Summary

This architecture provides:

🧠 Intelligent, intent-based search
🎯 Better relevance and ranking
⚡ Efficient filtering and performance
🏁 Final Statement

This system combines AI-powered semantic understanding with efficient database filtering to deliver a modern, scalable search experience.