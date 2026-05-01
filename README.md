# Wanderlust – AI-Powered Travel Discovery & Planning Platform

**Live Application:** https://wanderlust-aqw0.onrender.com/

## About
Wanderlust is a full-stack travel discovery and planning application that allows users to explore travel listings, create their own listings, and receive intelligent recommendations using a hybrid search system combining MongoDB full-text search and vector-based semantic search (RAG-based approach).

---

## Features

- Travel listings with full CRUD functionality
- Wishlist, reviews, and ratings system
- Secure authentication using Passport.js
- Session management with Connect-Mongo
- Hybrid search (keyword + semantic vector search)
- Multi-criteria filtering (price, category, mood)
- Debounced search input for performance optimization
- Pagination for efficient data loading
- AI-powered travel assistant using RAG (MongoDB + Vector Search + LLM)
- Location services using OpenCage API
- Smart itinerary planner for day-wise travel planning

---

## Tech Stack

**Frontend:** HTML, CSS, JavaScript, Bootstrap, EJS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** Passport.js, Connect-Mongo  
**AI / Search:** Vector Search, MongoDB Full-Text Indexing, Hugging Face Transformers, Kilo AI  
**Services:** Cloudinary, Multer, OpenCage API

---

## How to Run Locally

1. Clone the repository
```bash
git clone <repo-link>
cd wanderlust
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file and add required environment variables
```
MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
OPENCAGE_API_KEY=your_api_key
SESSION_SECRET=your_secret
```

4. Start the server
```bash
npm start
```

5. Open in browser
```
http://localhost:8080
```

---

## Author
Srishti Verma  
