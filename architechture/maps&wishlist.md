# 🧠 Wishlist Feature Architecture (Wanderlust App)

## 📌 Overview

The Wishlist feature allows users to save travel destinations and revisit them later. It is designed as a **lightweight, client-driven system** using `localStorage` on the frontend and a **REST API-based backend** for fetching listing details from MongoDB.

---

# 🏗️ Architecture Summary

## 🔷 High-Level Flow

```
User clicks ❤️
   ↓
Store listing ID in localStorage
   ↓
User visits /wishlist page
   ↓
Frontend reads stored IDs
   ↓
Calls backend API (/api/listings-by-ids)
   ↓
Backend fetches listings from MongoDB
   ↓
Frontend renders wishlist UI
```

---

# 🧩 System Components

## 1. Frontend (Client Side)

### Responsibilities:

* Store wishlist IDs in `localStorage`
* Fetch full listing data from backend
* Render UI dynamically
* Handle search, sort, filter
* Manage remove / clear / export actions

### Key Files:

* wishlist.ejs
* client-side JS (wishlist logic)

---

## 2. Backend (Node.js + Express)

### Responsibilities:

* Expose API endpoint for wishlist data
* Fetch listings from MongoDB
* Maintain order of user-selected IDs
* Return optimized dataset

### Key Route:

```
GET /api/listings-by-ids
```

---

## 3. Database (MongoDB)

### Collection: Listings

Stores destination data:

* title
* location
* country
* image
* category
* mood
* estimatedCost
* reviews

---

# 🔁 Detailed Workflow

## Step 1: Save Wishlist Item

When a user clicks the heart icon:

```js
localStorage.setItem("wl_favs", JSON.stringify(ids));
```

✔ Only IDs are stored (not full data)

---

## Step 2: Load Wishlist Page

On page load:

```js
const ids = JSON.parse(localStorage.getItem("wl_favs"));
```

If empty → show empty state

---

## Step 3: Fetch Data from Backend

Frontend sends request:

```
GET /api/listings-by-ids?ids=123,456
```

---

## Step 4: Backend Processing

### Convert query to array

```js
ids.split(",")
```

### Fetch from MongoDB

```js
Listing.find({ _id: { $in: idArr } })
```

### Maintain order

```js
const ordered = idArr.map(id =>
  listings.find(l => l._id.toString() === id)
);
```

---

## Step 5: Send Response

```js
res.json({ listings: ordered });
```

---

## Step 6: Render UI

Frontend:

* Creates cards dynamically
* Displays image, title, location, metadata

---

# 🔍 Features Breakdown

## 1. Searching

* Client-side filtering
* Multi-field search (title, location, country, category, mood)
* Case-insensitive matching

```js
filterMatch(l, query)
```

---

## 2. Sorting

Supports 3 modes:

### 🔤 A → Z

```js
localeCompare(a.title, b.title)
```

### 💎 Hidden Gems First

```js
sort by isHiddenGem flag
```

### 📌 Default

* Preserves saved order

---

## 3. Filtering

Combines search + sort:

```
All Data → Filter → Sort → Render
```

---

## 4. Remove from Wishlist

### Flow:

* Remove ID from localStorage
* Update UI state
* Remove card dynamically

---

## 5. Clear All Wishlist

### Flow:

* Empty localStorage
* Reset frontend state
* Show empty UI

```js
localStorage.setItem("wl_favs", "[]")
```

---

## 6. Export Wishlist

### Uses Blob API

Steps:

1. Convert data → text format
2. Create Blob
3. Generate download link
4. Trigger download

```js
const blob = new Blob([content], { type: 'text/plain' });
```

---

# ⚙️ Key Design Decisions

## ✔ Client-side storage (localStorage)

* Fast
* No DB writes
* Simple architecture

## ✔ Backend only for data fetching

* Keeps DB clean
* Ensures fresh data

## ✔ Order preservation logic

* Maintains user experience consistency

## ✔ Stateless wishlist system

* No authentication dependency required

---

# 🚀 Performance Considerations

* Uses `.select()` to fetch only required fields
* Avoids storing full objects in localStorage
* Filters on client side for speed

---

# ⚠️ Limitations

* Not scalable for very large datasets
* Search is client-side only
* No real-time sync across devices

---

# 💡 Possible Improvements

* Move search to backend (MongoDB text index)
* Add user-based wishlist storage in DB
* Add pagination for large lists
* Add debounce for search input

---

# 🧠 Summary

The Wishlist system is a **hybrid architecture**:

* 🖥 Frontend → state + UI + interactions
* 🌐 Backend → data retrieval
* 🗄 Database → source of truth

It balances **performance, simplicity, and scalability for a mid-level production app.**

# 🗺️ Wanderlust Map Feature Documentation

## 📌 Overview

Wanderlust integrates an interactive mapping system to visually display the exact location of each travel listing. This enhances user experience by allowing users to explore destinations geographically instead of only reading textual descriptions.

The system is built using a fully open-source mapping stack:
- Leaflet.js for map rendering
- OpenStreetMap for map tiles
- Nominatim API for geocoding (location → coordinates)

---

## ⚙️ Technologies Used

### 🗺️ Leaflet.js
:contentReference[oaicite:0]{index=0}  
Leaflet is used to create and control the interactive map in the browser.

**Responsibilities:**
- Rendering map UI
- Setting zoom & center
- Adding markers and shapes
- Handling user interactions (zoom, pan)

---

### 🌍 OpenStreetMap
:contentReference[oaicite:1]{index=1}  
OpenStreetMap provides the actual map tiles (roads, terrain, cities, labels).

**Responsibilities:**
- Serving map images (tiles)
- Providing global geographic data
- Free and open-source map infrastructure

---

### 📍 Nominatim API
:contentReference[oaicite:2]{index=2}  
Nominatim is used for geocoding (converting location text into latitude & longitude).

**Example:**

"Manali, India" → { lat: 32.2432, lng: 77.1892 }


---

## 🔄 System Flow


User enters location (text)
↓
Backend (Nominatim API)
↓
Convert text → coordinates (lat, lng)
↓
Send coordinates to frontend (EJS)
↓
Leaflet renders interactive map
↓
OpenStreetMap provides map visuals


---

## 🧠 How It Works (Backend)

### Geocoding Function
```js
async function getCoordinates(location, country) {
  const query = encodeURIComponent(`${location}, ${country}`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "WanderlustApp/1.0"
    }
  });

  const data = await res.json();

  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon)
    };
  }

  return { lat: 28.6448, lng: 77.2167 }; // fallback (Delhi)
}
🧠 How It Works (Frontend)
Map Initialization
const map = L.map("map").setView([lat, lng], 14);
Add OpenStreetMap Tiles
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
Add Marker
L.marker([lat, lng])
  .addTo(map)
  .bindPopup(title)
  .openPopup();
Add Radius Circle
L.circle([lat, lng], {
  radius: 1000,
  color: "red",
  fillOpacity: 0.2
}).addTo(map);
🎯 Features
📍 Exact location marker for listings
🗺️ Interactive zoomable map
🔴 Area radius visualization
⚡ Open-source, no Google Maps dependency
🛡️ Fallback coordinates for reliability
🚀 Why This Approach?
Fully free and open-source stack
No API key dependency (OpenStreetMap + Nominatim)
Lightweight and fast rendering
Highly customizable frontend mapping
Easy integration with Node.js + Express backend
🧠 Interview Explanation (Important)
❓ Q: How did you implement maps in your Wanderlust project?

In my Wanderlust travel platform, I implemented an interactive map system using Leaflet.js, OpenStreetMap, and Nominatim API.

When a user opens a listing, I first extract the location string from the database. Since this is not in coordinate form, I use the Nominatim geocoding API to convert the location into latitude and longitude.

These coordinates are then passed from the backend to the frontend using server-side rendering (EJS).

On the frontend, I initialize a Leaflet map centered on these coordinates. I then add a marker to show the exact location and a circular overlay to highlight the surrounding area.

OpenStreetMap provides the actual map tiles, while Leaflet handles rendering and interactivity.

This approach gives a lightweight, fully open-source mapping solution without relying on paid services like Google Maps.

🔮 Future Improvements
Map clustering for multiple listings
Nearby attractions detection
Heatmaps for popular destinations
User live location integration
Route/directions between listings
🏁 Summary
