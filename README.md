# Wanderlust – AI-Powered Travel Discovery & Planning Platform

**Live Application:** https://wanderlust-aqw0.onrender.com/

## About
Wanderlust is a full-stack travel listing and planning platform that helps users discover unique stays and plan trips intelligently using AI.

It combines a modern travel marketplace with a smart itinerary planner, allowing users to explore destinations, filter listings based on preferences, and generate personalized day-wise travel plans.

The platform features a hybrid search system that blends traditional keyword search with semantic vector search, enabling more relevant and intent-aware results. An integrated AI travel assistant understands natural language queries (like budget, location, or travel style) and provides context-aware recommendations grounded in real listings.

Wanderlust also includes rich media support (images/videos), wishlist management, reviews & ratings, interactive maps, and exportable itineraries—creating a complete end-to-end travel planning experience.

Built using the MERN stack, the project follows a scalable MVC architecture with secure authentication, robust validation, and optimized performance.

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
**Services:** Cloudinary, Multer, Leaflet , OpenStreetsMap

---

# Run the Project

```env
# Getting Started

## 1. Clone the Repository
git clone https://github.com/your-username/wanderlust.git
cd wanderlust

2.Create a `.env` file in the root directory and add the following:

MONGO_URI=your_mongodb_uri
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
SESSION_SECRET=your_secret

3. Install Dependencies
npm install

4. Initialize Database
cd init
node index.js
cd ..

5. Run the Application

Development mode
npm run dev

Using nodemon
nodemon app.js

Standard start
npm start

6. Access the Application

Open in browser:
http://localhost:3000

```

---

## Author
Srishti Verma  
