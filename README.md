# 🌍 Wanderlust – AI-Powered Travel Listing & Planning Platform

Wanderlust is a full-stack travel listing and intelligent trip planning application designed to deliver personalized travel experiences through a combination of traditional web systems and modern AI-driven search capabilities.

The platform integrates **hybrid search architecture, AI-based recommendation systems, and scalable backend design** to provide users with efficient discovery and planning of travel destinations.

---

## 🚀 Live Application  
https://wanderlust-aqw0.onrender.com/

---

## 📌 Project Overview

Wanderlust enables users to explore, create, and manage travel listings while leveraging AI to enhance search relevance and travel recommendations. The system combines structured database querying with semantic understanding to support both precise and natural language-based search inputs.

---

## ⚙️ Core Features

### Travel Listings System
- Full CRUD operations for travel listings
- Wishlist, reviews, and rating functionality
- Secure image upload and storage using Cloudinary + Multer
- Server-side validation implemented using Joi

### Authentication & Authorization
- Secure user authentication using Passport.js
- Session management with Connect-Mongo
- Protected routes and role-based access control

### Hybrid Search Architecture
- MongoDB Full-Text Search for fast keyword-based queries  
- Vector-Based Semantic Search for natural language and mood-based queries  
- Intelligent query routing between keyword and semantic search
- Debounced input handling to reduce unnecessary API calls
- Multi-criteria filtering (price, category, mood)
- Pagination for optimized data retrieval and rendering

### AI-Powered Travel Assistant (Hybrid RAG System)
- NLP-driven query interpretation
- Retrieval-Augmented Generation (RAG) architecture combining:
  - MongoDB filtered retrieval
  - Vector similarity search
  - LLM-based response generation
- Context-aware travel recommendations and itinerary suggestions

### Location & Planning Features
- Interactive map integration using OpenCage API
- Smart itinerary planner for structured day-wise trip creation
- Location-based enrichment of listings

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
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=for-the-badge)

### Authentication
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge)
![Connect-Mongo](https://img.shields.io/badge/Session%20Store-FF6F00?style=for-the-badge)

### AI & Search
![Vector Search](https://img.shields.io/badge/Vector%20Search-AI-blue?style=for-the-badge)
![HuggingFace](https://img.shields.io/badge/HuggingFace-FFCC4D?style=for-the-badge)
![Kilo AI](https://img.shields.io/badge/Kilo%20AI-FF4B4B?style=for-the-badge)

### Services
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge)
![OpenCage](https://img.shields.io/badge/OpenCage%20API-1E90FF?style=for-the-badge)

---

## 🧠 System Highlights

- Hybrid keyword + semantic search architecture
- AI-driven context-aware recommendation system
- Optimized backend performance using debouncing and pagination
- Scalable authentication and session management system
- Production-ready full-stack architecture with real-world use case

---

## 📈 Impact

This project demonstrates strong capabilities in:

- Full-stack system design and implementation
- AI integration into traditional web applications
- Search system optimization (lexical + semantic fusion)
- Backend scalability and performance optimization
- Real-world problem-solving using modern web technologies

---

## 🔮 Future Enhancements

- AI-based dynamic pricing estimation for trips
- Real-time booking and reservation system
- Social travel feed with user-generated itineraries
- Mobile application (React Native / Flutter)
- Personalized recommendation engine using user behavior tracking

---

## 👨‍💻 Author

**Srishti Verma**  
Full Stack Developer | AI & Systems Enthusiast
