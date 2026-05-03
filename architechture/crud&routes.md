# 🧳 Wanderlust – CRUD Architecture

## 📌 Overview

Wanderlust is a full-stack travel listing platform built using the **MERN stack (Node.js, Express.js, MongoDB, EJS)**.
This document explains the **CRUD architecture** for listings, reviews, and media handling.

---

## 🏗️ Architecture Pattern

* **MVC (Model-View-Controller)**
* **RESTful Routes**
* Middleware-based request validation & authentication

---

## 📂 Folder Structure

```
/models        → Mongoose schemas (Listing, Review)
/controllers   → Business logic (listing.js, review.js)
/routes        → Express routers
/middleware    → Auth + validation
/utils         → Helpers (wrapAsync, vectorSearch)
/cloudConfig   → Cloudinary + Multer config
/views         → EJS templates
```

---

## 🔁 CRUD Operations (Listings)

### ➤ Create Listing

**Route:** `POST /listings`

* Uses `multer` for image upload
* Stores image in **Cloudinary**
* Validated using **Joi**
* Assigns current user as owner

```js
router.post(
  "/",
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);
```

---

### ➤ Read Listings

#### 1. All Listings

**Route:** `GET /listings`

* Supports:

  * Search (text + semantic)
  * Filters (price, mood, category)
* Uses:

  * MongoDB `$text` search
  * Vector search (custom embeddings)

---

#### 2. Single Listing

**Route:** `GET /listings/:id`

* Populates:

  * Reviews
  * Owner
* Fetches coordinates using geocoding API

---

### ➤ Update Listing

**Route:** `PATCH /listings/:id`

* Authorization:

  * `isLoggedIn`
  * `isOwner`
* Supports:

  * Text updates
  * Image replacement
* Re-saves listing (triggers embedding update if applicable)

```js
router.patch(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.editListing)
);
```

---

### ➤ Delete Listing

**Route:** `DELETE /listings/:id`

* Only owner can delete
* Removes listing from database

---

## 🖼️ Media Handling (Gallery)

### Add Media

**Route:** `POST /listings/:id/gallery`

* Upload multiple files (max 10)
* Supports images & videos
* Stored in Cloudinary

---

### Delete Media

**Route:** `POST /listings/:id/gallery/delete` -wrong should be delete req /listings/:id/gallery/delete

* Deletes from:

  * Cloudinary
  * MongoDB array

---

## ⭐ Reviews CRUD

### ➤ Create Review

**Route:** `POST /listings/:id/reviews`

* Uses `multer` for multipart form data
* Fixes issue:

  * `req.body` undefined without multer
* Supports:

  * Rating
  * Comment
  * Media (images/videos)

---

### ➤ Delete Review

**Route:** `DELETE /listings/:id/reviews/:reviewId`

* Removes:

  * Review document
  * Reference from listing

---

## 🛡️ Middleware Layer

### Authentication

* `isLoggedIn` → ensures user is logged in
* `isOwner` → ensures ownership before edit/delete

### Validation

* `validateListing` → Joi schema validation

---

## ⚙️ Error Handling

* Centralized async error handler using:

  ```js
  wrapAsync(fn)
  ```
* Flash messages for:

  * Success
  * Failure

---

## 🔍 Search + Filter Integration (High-Level)

* **Text Search:** MongoDB `$text`
* **Semantic Search:** Vector embeddings
* **Filters:**

  * Price range
  * Mood
  * Category

---

## 🚀 Key Highlights

* Clean RESTful API design
* Secure CRUD with ownership checks
* Optimized media handling (Cloudinary + Multer)
* Hybrid search (keyword + semantic)
* Scalable MVC structure

---

## 📈 Future Improvements

* Pagination for all queries
* Soft delete (instead of permanent delete)
* Role-based access control (admin/user)
* Image optimization & lazy loading

---

## 🧠 Summary

The CRUD system in Wanderlust is designed to be:

* **Robust** → validation + error handling
* **Secure** → auth + ownership checks
* **Scalable** → modular MVC structure
* **Feature-rich** → media, reviews, search

---
🚀 Wanderlust – Features & AI Routes Architecture

This module handles AI assistant, itinerary planning, wishlist, and dynamic listing APIs in the Wanderlust platform. It integrates semantic search, NLP-based filtering, and RESTful APIs to deliver intelligent travel recommendations.

📂 Routes Overview
🌐 Page Routes
Route	Method	Description
/itinerary	GET	Renders Smart Itinerary Planner UI
/wishlist	GET	Displays user wishlist page
/ai-assistant	GET	Renders AI Travel Assistant interface
🤖 AI Assistant APIs
Route	Method	Description
/api/ai-chat	POST	Processes user queries using NLP + vector search + LLM
🔹 Flow:
Extract user intent using custom NLP parser
Identify:
Budget (min/max price)
Travel type (beach, mountain, luxury, etc.)
Region / destination
Itinerary intent
Fetch listings via:
Exact match → MongoDB query
Destination search → Full-text search
Fallback → Vector search (@xenova/transformers)
Generate response using Kilo AI (LLM) with structured system prompt
Return:
AI-generated reply
Relevant listing cards
🏨 Listings APIs (Feature Layer)
Route	Method	Description
/api/tb-listings	GET	Fetch listings for itinerary builder (destination-based)
/api/listings-by-ids	GET	Fetch selected listings by IDs (used in planner & wishlist)
🔍 Search Strategy (Used in APIs)
Hybrid Retrieval Approach:
MongoDB Full-Text Search → fast keyword matching
Vector Search → semantic similarity (embeddings)
Fallback Logic → ensures results even when no exact match
Search Priority:
1. Exact Listing Match
2. Destination-Based Search
3. Price Filtering
4. Show All Listings
5. Semantic Vector Search (fallback)
🧠 AI Processing Pipeline
User Query
   ↓
Intent & Filter Extraction (Regex + Keyword Mapping)
   ↓
Search Layer (MongoDB + Vector Search)
   ↓
Context Building (Listings + Platform Stats)
   ↓
LLM (Kilo AI)
   ↓
Response + Listing Cards
🧩 Key Features
✨ NLP-based query understanding (no external parser)
🔎 Hybrid search (text + semantic embeddings)
📍 Destination-aware recommendations
🧳 Smart itinerary detection & generation
⚡ Optimized result limiting (max 30 listings)
🎯 Context-aware AI responses (no hallucinated listings)
