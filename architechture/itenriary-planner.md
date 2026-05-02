/itinerary
   ↓
DOMContentLoaded
   ↓
detectLocation()
   ↓
User inputs data
   ↓
initBuilder()
   ↓
dayPlans created
   ↓
render UI
   ↓
User adds activities (click / drag)
   ↓
state updates (dayPlans)
   ↓
loadStays() → backend
   ↓
User adds stays
   ↓
generateFromBuilder()
   ↓
prompt built
   ↓
/ai-assistant

# 🧭 AI Itinerary Planner (Wanderlust Feature)

A full-stack **AI-powered itinerary builder** that allows users to:
- Plan trips day-by-day (Morning / Afternoon / Evening)
- Drag & drop activities into a visual timeline
- Discover AI-suggested stays (hotels)
- Generate full AI itineraries using structured prompts
- Use both quick form + advanced builder mode

---

# 🏗️ System Architecture Overview


Frontend (EJS + Vanilla JS)
↓
Express.js Backend (Node.js)
↓
MongoDB (Listings Database)
↓
AI Assistant (Prompt Generator + Chat API)


---

# ⚙️ Core Modules

## 1. 🧱 Itinerary Builder (Frontend UI)
- Visual drag-and-drop planner
- 3 time slots per day:
  - Morning
  - Afternoon
  - Evening
- Supports:
  - Suggested activities
  - Custom user entries
  - Dragging stays into itinerary

---

## 2. 🏨 Stay Recommendation System

### API:

GET /api/tb-listings?dest=jaipur


### Flow:
1. User enters destination
2. Backend performs:
   - MongoDB **text search** on:
     - title
     - location
     - country
3. If results found → return listings
4. If not found → **vectorSearch fallback**
5. Frontend renders top 6 stays

### Why hybrid search?
- Fast keyword matching (Mongo text index)
- Smarter semantic fallback (vector search)
- No empty UX

---

## 3. 📅 Itinerary State Management

Frontend uses:

```js
dayPlans = {
  0: { morning: [], afternoon: [], evening: [] },
  1: { ... }
}

Each activity contains:

{
  icon: "🏛️",
  label: "Visit Museum",
  sub: "Culture"
}
4. 🧲 Drag & Drop System
Implementation:

Uses native HTML Drag & Drop API

Key events:
ondragstart → store selected activity
ondragover → allow drop
ondrop → insert into itinerary
State used:
dragActivity
dragFromSlot
dragFromDayIdx
Behavior:
Suggestion → slot = COPY
Slot → slot = MOVE
Stay → slot = COPY
5. 🤖 AI Itinerary Generator
API:
POST /api/ai-chat
GET  /ai-assistant
Flow:
User builds partial itinerary OR uses quick form
System converts state into structured prompt:
destination
duration
budget
activities per slot
Sends prompt to AI assistant
AI returns:
full itinerary
restaurant suggestions
hidden gems
cost estimates (INR)
travel tips
6. ⚡ Quick Form Generator

Allows users to generate itinerary in 1 step:

Inputs:

Destination
Duration
Budget
Interests
Food preferences
Must-visit places

Converts into structured AI prompt.

7. 🗺️ Location Detection

Uses:

navigator.geolocation
Reverse geocoding (OpenStreetMap)

Used to personalize prompts like:

"travelling from Mumbai"

🔄 End-to-End Flow
User enters destination
        ↓
Load suggested activities
        ↓
User drags activities into itinerary
        ↓
System builds dayPlans object
        ↓
Fetch stays via /api/tb-listings
        ↓
User optionally adds stays via drag-drop
        ↓
Generate AI prompt
        ↓
AI returns final itinerary
🧠 Key Engineering Decisions
1. Hybrid Search Strategy
MongoDB text search (fast)
Vector search fallback (semantic understanding)
2. Client-side State Model
No Redux / external state library
Lightweight in-memory JS object (dayPlans)
3. Drag & Drop (No Libraries)
Native HTML5 Drag API used
Avoids dependency overhead
Fully custom behavior control
4. API Design
REST-based modular routes
Separate endpoints for:
listings
AI chat
itinerary data
🚀 Tech Stack
Frontend:
EJS Templates
Vanilla JavaScript
CSS (custom UI system)
Backend:
Node.js
Express.js
Database:
MongoDB
Text indexes for search
AI Layer:
Prompt-based itinerary generator
📌 What makes this project strong (Interview Highlights)

✔ Real-world Airbnb-like architecture
✔ Hybrid search system (text + vector fallback)
✔ Drag-and-drop itinerary builder (custom implementation)
✔ AI-powered structured prompt engineering
✔ Modular Express backend APIs
✔ Optimized UX with progressive enhancement

🧑‍💻 Interview Explanation (How to say it)

“This is a full-stack itinerary planner where users can visually build travel plans using drag-and-drop. We maintain a structured day-wise state in the frontend and sync it with a backend that provides stay recommendations using MongoDB text search with a vector fallback. Once the user completes or partially builds an itinerary, we convert the entire state into a structured prompt and send it to an AI assistant, which generates a complete travel plan with suggestions, costs, and hidden gems.”

🔥 Future Improvements
Replace vector search with embeddings DB (Pinecone / Mongo Atlas Vector)
Add real-time collaborative itinerary editing
Save itineraries per user
Add map-based planning (Google Maps integration)
Replace vanilla JS with React for scalability
📎 Summary
