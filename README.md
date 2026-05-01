# 🌍 Wanderlust – AI-Powered Travel Listing & Planning Platform

![Live](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![AI](https://img.shields.io/badge/AI--Powered-System-blue?style=for-the-badge)

**Live Application:** https://wanderlust-aqw0.onrender.com/

---

## 📌 Overview

Wanderlust is a production-style full-stack travel discovery and itinerary planning platform that integrates **AI-powered semantic search, traditional database querying, and intelligent recommendation systems**.

The system is designed to support both structured filters and natural language queries through a **hybrid search architecture (MongoDB + Vector Search + LLM reasoning)**.

---

## 🧭 Table of Contents

- Project Overview
- Core Features
- System Architecture
- AI & Search Pipeline
- Tech Stack
- Key System Highlights
- Future Enhancements
- Author

---

## ⚙️ Core Features

### 🏡 Travel Listings System
- Full CRUD functionality for travel listings
- Wishlist, reviews, and ratings system
- Cloud image storage using **Cloudinary + Multer**
- Robust server-side validation using **Joi**

### 🔐 Authentication System
- Secure login/signup using **Passport.js**
- Session persistence via **Connect-Mongo**
- Protected routes and authorization middleware

### 🔎 Hybrid Search Engine
- MongoDB **full-text search** for structured queries
- Vector-based **semantic search** for natural language inputs
- Intelligent routing between keyword and semantic search
- Debounced input handling to minimize API calls
- Multi-criteria filtering (price, category, mood)
- Pagination for scalable result rendering

---

## 🤖 AI Search & Recommendation Pipeline

```
User Query → Intent Detection → Routing Layer
        ↓
   ┌──────────────┬─────────────────┐
   │              │                 │
Keyword Query   Semantic Query   Hybrid Query
(MongoDB)       (Vector DB)      (Combined)
   │              │                 │
   └─────── Retrieval Layer (Mongo + Vectors) ───────┘
                        ↓
              LLM (Kilo AI / Transformers)
                        ↓
         Context-Aware Travel Recommendations
```

### 🧠 AI Capabilities
- Natural language understanding (NLP)
- Retrieval-Augmented Generation (RAG)
- Context-aware itinerary generation
- Semantic ranking of listings

---

## 🗺️ Location & Planning Features
- Geolocation integration using **OpenCage API**
- Smart day-wise itinerary planner
- Location enrichment for travel listings

---

## 🛠️ Tech Stack

### Frontend
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-8A2BE2?style=for-the-badge)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)

### AI & Search Layer
![Vector Search](https://img.shields.io/badge/Vector_Search-Semantic-blue?style=for-the-badge)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFCC4D?style=for-the-badge)
![Kilo AI](https://img.shields.io/badge/Kilo_AI-FF4B4B?style=for-the-badge)

### Services
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge)
![OpenCage](https://img.shields.io/badge/OpenCage_API-1E90FF?style=for-the-badge)

---

## 🚀 System Highlights

- Hybrid **keyword + semantic + AI routing architecture**
- Retrieval-Augmented Generation (RAG) based recommendation engine
- Optimized performance using **debouncing + pagination**
- Scalable authentication & session management system
- Production-ready full-stack architecture

---

## 📈 Impact

This project demonstrates expertise in:
- Full-stack system design and architecture
- AI integration into web applications (RAG systems)
- Advanced search optimization (lexical + semantic fusion)
- Backend scalability and performance engineering
- Real-world product-level system design thinking

---

## 🔮 Future Enhancements

- AI-based dynamic pricing engine
- Real-time booking system integration
- Social travel feed with user itineraries
- Mobile application (React Native / Flutter)
- Personalized recommendation engine using user behavior analytics

---

## 👨‍💻 Author

**Srishti Verma**  
Full Stack Developer | AI & Systems Enthusiast
