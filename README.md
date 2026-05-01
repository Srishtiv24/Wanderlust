# Wanderlust – AI-Powered Travel Listing & Planning Platform

**Live Application:** https://wanderlust-aqw0.onrender.com/

Wanderlust is a full-stack travel discovery and planning platform that combines traditional listing-based functionality with AI-powered semantic search and retrieval-augmented generation (RAG). The system is designed to support both structured database queries and natural language-based search through a hybrid search architecture.

---

## Overview

Wanderlust enables users to explore, create, and manage travel listings while receiving intelligent recommendations based on mood, context, and natural language queries. The platform integrates lexical search (MongoDB full-text indexing) with semantic vector search to improve relevance and user experience.

---

## Key Features

### Travel Listings System
- Full CRUD functionality for travel listings
- Wishlist, reviews, and ratings support
- Image upload and management using Cloudinary and Multer
- Server-side validation using Joi

### Authentication System
- Secure authentication using Passport.js
- Session management with Connect-Mongo
- Protected routes and authorization middleware

### Hybrid Search System
- MongoDB full-text search for keyword-based queries
- Vector-based semantic search for natural language queries
- Dynamic routing between keyword and semantic search
- Debounced input handling to reduce unnecessary API requests
- Multi-criteria filtering (price, category, mood)
- Pagination for efficient data rendering

### AI-Powered Travel Assistant (RAG)
- Natural language query interpretation using NLP
- Retrieval-augmented generation pipeline combining:
  - MongoDB filtered retrieval
  - Vector similarity search
  - LLM-based response generation
- Context-aware travel recommendations and itinerary planning

### Location and Planning Features
- Geolocation services using OpenCage API
- Structured day-wise itinerary planner
- Location enrichment for listings

---

## System Architecture

The system follows a hybrid architecture:

User Query → Intent Detection → Routing Layer → Retrieval Layer → Response Generation

- Keyword queries are processed via MongoDB full-text search
- Semantic queries are processed via vector embeddings
- Hybrid queries combine both approaches
- Final output is enhanced using LLM-based reasoning

---

## Tech Stack

**Frontend:** HTML, CSS, JavaScript, Bootstrap, EJS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB, Mongoose  
**Authentication:** Passport.js, Connect-Mongo  
**AI & Search:** Vector Search, MongoDB Full-Text Indexing, Hugging Face Transformers, Kilo AI  
**Services:** Cloudinary, Multer, OpenCage API

---

## System Highlights

- Hybrid keyword and semantic search architecture
- Retrieval-augmented generation (RAG) based recommendation system
- Optimized backend performance using debouncing and pagination
- Scalable authentication and session management
- Production-ready full-stack architecture with real-world use case

---

## Impact

This project demonstrates strong capabilities in full-stack system design, AI integration in web applications, and search system optimization. It highlights the ability to combine structured database querying with semantic AI-based retrieval to solve real-world discovery and recommendation problems.

---

## Future Enhancements

- AI-based dynamic pricing engine
- Real-time booking and reservation system
- Social travel feed with user-generated itineraries
- Mobile application (React Native / Flutter)
- Personalized recommendation system based on user behavior

---

## Author

Srishti Verma  
Full Stack Developer | AI Systems Enthusiast
