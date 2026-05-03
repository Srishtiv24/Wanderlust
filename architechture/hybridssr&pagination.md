📡 AJAX, Fetch, Axios & SSR – Quick Guide
🧠 Overview

Modern web apps avoid full page reloads by sending background HTTP requests from the browser to the server. This is commonly referred to as AJAX.

🔄 What is AJAX?

AJAX (Asynchronous JavaScript and XML) is a technique, not a library.

👉 It allows:

Sending requests in the background
Updating UI without reloading the page

✅ Used in:

Search suggestions
Filters
Wishlist toggles
⚙️ Methods to Implement AJAX
1. XHR (XMLHttpRequest) – Legacy

Old way of making AJAX calls.

const xhr = new XMLHttpRequest();
xhr.open("GET", "/api/data");
xhr.onload = () => console.log(xhr.responseText);
xhr.send();

❌ Hard to read
❌ Callback-based
👉 Mostly outdated

2. Fetch API – Modern Standard

Built-in browser API for HTTP requests.

const res = await fetch("/api/data");
const data = await res.json();

✅ Native (no install)
✅ Promise-based
✅ Works with async/await

❌ No auto JSON parsing
❌ No built-in timeout

3. Axios – Library

A third-party library for easier HTTP requests.

const res = await axios.get("/api/data");
console.log(res.data);

✅ Cleaner syntax
✅ Auto JSON parsing
✅ Better error handling
✅ Interceptors support

❌ Requires installation

🧠 Key Differences
Feature	XHR	Fetch	Axios
Type	Old API	Native API	Library
Syntax	Complex	Clean	Cleaner
Promises	❌	✅	✅
JSON Handling	❌	❌	✅
Install Needed	❌	❌	✅
🔗 Relationship
AJAX → Concept
XHR → Old implementation
Fetch → Modern built-in implementation
Axios → Library built on XHR/HTTP

👉 Fetch and Axios are alternatives, not dependent on each other.

🧩 SSR vs AJAX
✅ Server-Side Rendering (SSR)
Server generates full HTML
Page reload occurs

Used for:

Initial page load
SEO pages
Static content
✅ AJAX / Fetch / Axios
Updates part of page without reload

Used for:

Search
Filters
Wishlist actions
Dynamic UI
🚀 Usage in Wanderlust Project
SSR (Server-rendered pages)
/listings
/listings/:id
/wishlist
/login, /signup
AJAX (Dynamic interactions)
❤️ Wishlist toggle
🔍 Search
🎯 Filters & sorting
📜 Infinite scroll
🧠 Rule of Thumb

👉 SSR = Page load
👉 AJAX = Page interaction

✅ Recommendation
Start with Fetch API


Fetch and Axios are two different ways to perform AJAX requests. Fetch is a native browser API, while Axios is a library that internally uses XHR in the browser and the HTTP module in Node.js, making it usable in both environments.

pagination 

