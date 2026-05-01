# 🧠 Wanderlust AI Travel Assistant – Hybrid RAG Architecture

## 📌 Overview

The Wanderlust AI Assistant is a **Hybrid RAG (Retrieval-Augmented Generation)** system that provides:

* ✈️ Travel itineraries
* 🏡 Stay recommendations
* 🎯 Personalized travel suggestions

It combines:

* Rule-based NLP (intent + filters)
* MongoDB structured queries
* Semantic vector search
* LLM-based response generation

---

## 🚀 Core Idea (Interview Ready)

> It’s a hybrid RAG-based travel assistant that combines rule-based NLP, structured database queries, and semantic vector search to retrieve listings, and then uses an LLM to generate responses.

> I use a routing layer to decide the best retrieval strategy—exact match, MongoDB filtering, or vector search—and inject the results into the LLM for contextual responses.

---

## 🏗️ Architecture Diagram

```
User Query
   ↓
NLP Filter Extraction (Regex + Keywords)
   ↓
Intent Classification + Routing Layer
   ↓
───────────────────────────────────────
| Retrieval Strategy Selection        |
|                                     |
| 1. Exact Match (Title Search)       |
| 2. MongoDB Filter Query             |
| 3. Vector Semantic Search           |
───────────────────────────────────────
   ↓
Context Injection (RAG)
   ↓
LLM Response Generation
   ↓
Frontend (Chat UI + Listing Cards)
```

---

## 🧩 System Components

### 1. 🧠 NLP Filter Extraction

Extracts structured data using:

* Regex
* Keyword matching

**Extracted Fields:**

* Location (e.g., Goa)
* Price range (e.g., under ₹2000)
* Category (beach, mountain, luxury)
* Intent (search / itinerary)

**Example:**

```
Input: "Cheap beach stays in Goa under ₹2000"

Output:
{
  location: "Goa",
  maxPrice: 2000,
  category: "beach",
  intent: "search"
}
```

---

### 2. 🔀 Routing Layer

Decides the best retrieval method.

| Condition           | Strategy      |
| ------------------- | ------------- |
| Exact title present | Direct lookup |
| Filters present     | MongoDB query |
| Vague query         | Vector search |
| Travel planning     | LLM-focused   |

---

### 3. 🔎 Retrieval Layer

#### A. MongoDB Structured Search

Used when filters are clear.

```js
Listing.find({
  location: /goa/i,
  price: { $lte: 2000 },
  category: "beach"
});
```

✔ Fast
✔ Accurate

---

#### B. Vector Search (Semantic)

Used for vague queries like:

* “romantic getaway”
* “peaceful stay”

Flow:

1. Convert query → embedding
2. Compare with stored embeddings
3. Retrieve similar listings

✔ Handles ambiguity
✔ Better recommendations

---

#### C. Exact Match

For precise queries:

* “Show Taj Hotel listing”

✔ Fastest
✔ Deterministic

---

### 4. 📦 Context Injection (RAG)

Retrieved listings are passed into the LLM:

```
User Query: "Romantic trip to Goa"

Context:
- Beach villa ₹3000
- Cozy cottage ₹2000
```

This reduces hallucination and improves accuracy.

---

### 5. 🤖 LLM Response Generation

LLM generates:

* Travel itineraries
* Recommendations
* Suggestions

---

### 6. 🎨 Frontend Rendering

Features:

* Chat UI
* Typewriter effect
* Listing cards
* PDF export

---

## 🔄 Data Flow

```
User Input
   ↓
Frontend (Chat UI)
   ↓
Backend (/api/ai-chat)
   ↓
NLP Extraction
   ↓
Routing Decision
   ↓
Retrieval (Mongo / Vector / Exact)
   ↓
Context Injection
   ↓
LLM Response
   ↓
JSON Response:
{
  reply: "...",
  listings: [...]
}
   ↓
Frontend Rendering
```

---

## ⚡ Why Hybrid RAG?

| Approach    | Problem         |
| ----------- | --------------- |
| Only LLM    | Hallucinations  |
| Only DB     | No intelligence |
| Only vector | Less precision  |

### ✅ Hybrid Benefits

* ✔ High accuracy (DB filters)
* ✔ Semantic understanding (vector search)
* ✔ Natural responses (LLM)
* ✔ Better performance (routing)

---

## 🎯 Key Features

* Intent classification
* Smart routing logic
* Hybrid retrieval system
* RAG-based responses
* Itinerary generation
* Listing recommendations
* PDF export

---

## ⚖️ Trade-offs

| Trade-off  | Reason                   |
| ---------- | ------------------------ |
| Complexity | Multiple retrieval paths |
| Cost       | Embeddings + LLM         |
| Latency    | LLM response time        |

---

## 🔮 Future Improvements

* Personalization (user history)
* AI memory (conversation context)
* Real-time pricing APIs
* Voice assistant
* Learning-based ranking

---

## 🧾 Final Interview One-Liner

> It’s a hybrid RAG system where I extract structured filters using NLP, route the query to MongoDB or vector search, and inject results into an LLM to generate accurate and context-aware travel responses.

---
