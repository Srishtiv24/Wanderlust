# 🌍 Wanderlust – Authentication & Authorization System

## 📌 Overview

Wanderlust uses a **secure session-based authentication system** built with:

* **Express.js**
* **Passport.js (Local Strategy)**
* **MongoDB (via Mongoose)**
* **express-session + connect-mongo**

It provides:

* User signup & login
* Session persistence
* Access control (authorization)
* Flash messages for UX

---

## 🔐 Type of Authentication Used

### ✅ Session-Based Authentication (Stateful)

* User logs in → server creates a **session**
* Session ID stored in **cookie (connect.sid)**
* Session data stored in **MongoDB**
* On each request → session is verified → user restored

---

## 🤔 Why Session-Based Auth?

| Reason                 | Explanation                                       |
| ---------------------- | ------------------------------------------------- |
| 🔒 More secure         | Uses **HttpOnly cookies** (not accessible via JS) |
| 🔁 Automatic handling  | Browser sends cookies automatically               |
| 🧠 Server control      | Sessions can be invalidated anytime               |
| 🛡️ Better against XSS | Compared to localStorage tokens                   |
| 🔗 Easy integration    | Works seamlessly with Passport                    |

---

## 🧱 Architecture Diagram

```
        ┌──────────────┐
        │   Browser    │
        │ (Client UI)  │
        └──────┬───────┘
               │  HTTP Request
               ▼
        ┌──────────────┐
        │  Express App │
        │ (Node.js)    │
        └──────┬───────┘
               │
     ┌─────────▼─────────┐
     │ express-session   │
     │ (Session Manager) │
     └─────────┬─────────┘
               │
     ┌─────────▼─────────┐
     │   Passport.js     │
     │ (Auth Middleware) │
     └─────────┬─────────┘
               │
     ┌─────────▼─────────┐
     │   MongoDB Atlas   │
     │ (Session Store +  │
     │  User Database)   │
     └───────────────────┘
```

---

## 🔄 Authentication Flow

### 📝 Signup Flow

1. User submits signup form
2. `User.register()` (passport-local-mongoose):

   * Hashes password
   * Stores user in DB
3. `req.login()` creates session
4. User is logged in immediately

---

### 🔑 Login Flow

1. User submits credentials
2. `passport.authenticate("local")`:

   * Verifies username & password
3. `serializeUser()`:

   * Stores **user ID** in session
4. Session saved in MongoDB
5. Cookie (`connect.sid`) sent to browser

---

### 🔁 Subsequent Requests

1. Browser sends cookie
2. Server retrieves session from MongoDB
3. `deserializeUser()`:

   * Fetches user from DB
4. User available as:

   ```js
   req.user
   ```

---

### 🚪 Logout Flow

1. `req.logout()` removes user from session
2. Session still exists but no user attached
3. User redirected

---

## 🧩 Key Components

### 📁 User Model

```js
userSchema.plugin(passportLocalMongoose);
```

* Adds:

  * username
  * hash
  * salt
  * authentication methods

---

### 🔐 Passport Configuration

```js
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

---

### 🗂 Session Configuration

```js
const sessionOptions = {
  store: MongoStore.create({ mongoUrl: ATLAS_URL }),
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  }
};
```

---

## 🛡️ Authorization (Access Control)

### Middleware Used

#### 1. `isLoggedIn`

```js
if (!req.isAuthenticated()) {
  req.session.redirectUrl = req.originalUrl;
  return res.redirect("/login");
}
```

✔ Protects routes
✔ Redirects back after login

---

#### 2. `isOwner`

✔ Only listing owner can edit/delete

---

#### 3. `isReviewAuthor`

✔ Only review author can modify/delete

---

## 📦 Session Storage (MongoDB)

Example session document:

```json
{
  "_id": "session_id",
  "expires": "2026-02-15T23:51:43.082Z",
  "session": "encrypted_data_blob"
}
```

Contains:

* `passport.user` → user ID
* cookie metadata
* flash messages

---

## 🍪 Why Cookies (Not Local Storage)?

| Feature         | Cookies    | Local Storage |
| --------------- | ---------- | ------------- |
| HttpOnly        | ✅ Yes      | ❌ No          |
| Auto-send       | ✅ Yes      | ❌ No          |
| XSS Protection  | ✅ Better   | ❌ Weak        |
| CSRF Protection | ✅ SameSite | ❌ None        |

---

## 🎯 How to Explain This in an Interview

### 🔥 Short Answer (30 sec)

> "I implemented session-based authentication using Passport.js with Local Strategy. User credentials are securely hashed using passport-local-mongoose. After login, only the user ID is stored in a MongoDB-backed session using connect-mongo. On each request, Passport deserializes the user and attaches it to req.user. I also implemented authorization middleware like isLoggedIn and isOwner to protect routes."

---

### 💡 Medium Answer (1–2 min)

> "My project uses session-based authentication with Passport.js. When a user signs up, their password is hashed and stored securely. During login, Passport verifies credentials and stores only the user ID in the session. The session is stored in MongoDB using connect-mongo, while the browser stores a session ID cookie. On every request, the session is validated and the user is reconstructed using deserializeUser. I also added authorization middleware to ensure only logged-in users and resource owners can perform certain actions."

---

### 🚀 Advanced Answer (3–4 min)

Include:

* Session lifecycle
* Cookie security (HttpOnly, SameSite)
* MongoDB session store
* serialize vs deserialize
* Difference from JWT

---

## ⚡ Key Takeaways

* ✔ Authentication = Identity (Who are you?)
* ✔ Authorization = Permission (What can you do?)
* ✔ Passport handles authentication logic
* ✔ Express-session handles session lifecycle
* ✔ MongoDB ensures persistence & scalability

---

## 🧠 Future Improvements

* JWT-based auth for APIs
* OAuth (Google Login)
* Role-based access control (RBAC)
* Rate limiting for login attempts
* CSRF protection

---

## 🧑‍💻 Author

Built as part of the **Wanderlust Travel Platform**

---

Sessions in MongoDB are deleted automatically when they expire using MongoDB’s TTL index, typically after the maxAge defined in the cookie. In my app, sessions live for 7 days. However, logout does not delete the session by default — it only removes the user from it. To fully remove the session, we need to call req.session.destroy(), which deletes it immediately from the database."

Why it’s STATEFUL (even if DB stores sessions)

In your setup:

Browser stores → session ID (cookie: connect.sid)
MongoDB stores → session data (user ID, etc.)
Server (Express) → reads session from DB on every request

👉 That means:

The system depends on stored session state somewhere (DB)

So it is stateful authentication.

I chose session-based authentication over JWT because my application is server-rendered using EJS, where sessions integrate seamlessly. Sessions allow automatic cookie handling and easy access to req.user, simplifying authorization. They also provide better control over logout, as sessions can be destroyed instantly. JWT is more suitable for stateless APIs or microservices, but for my use case, sessions are simpler, more secure, and more maintainable.”

# 🎤 Wanderlust – Authentication & Authorization Interview Guide

## 📌 Overview

This document contains **all important interview questions and answers** based on the authentication and authorization system used in Wanderlust.

The system is built using:

* **Session-based Authentication**
* **Passport.js (Local Strategy)**
* **MongoDB Session Store (connect-mongo)**
* **Express Middleware for Authorization**

---

# 🧠 1. Fundamentals

### ❓ What is Authentication vs Authorization?

* **Authentication** → Verifies identity (Who are you?)
* **Authorization** → Checks permissions (What can you do?)

---

### ❓ What type of authentication is used?

> Session-based authentication using Passport.js

---

### ❓ Is your system stateful or stateless?

> Stateful, because session data is stored and reused across requests.

---

### ❓ What is Passport.js?

> Middleware for handling authentication in Node.js using strategies like Local, OAuth, etc.

---

# 🔐 2. Authentication Flow

### ❓ Explain login flow in your app

1. User submits credentials
2. `passport.authenticate("local")` verifies them
3. `serializeUser()` stores user ID in session
4. Session stored in MongoDB
5. Cookie sent to browser

---

### ❓ What is stored in session?

> Only the **user ID**

---

### ❓ Why not store full user?

* Reduces session size
* Improves performance
* Always fetch latest user data

---

### ❓ What is `serializeUser`?

> Stores user ID in session

---

### ❓ What is `deserializeUser`?

> Fetches user from DB and attaches to `req.user`

---

### ❓ How do you access logged-in user?

```js
req.user
```

---

# 🍪 3. Sessions & Cookies

### ❓ Where is session stored?

> MongoDB (via connect-mongo)

---

### ❓ What is stored in browser?

> Cookie (`connect.sid`) with session ID

---

### ❓ What is HttpOnly cookie?

> Cannot be accessed by JavaScript (prevents XSS)

---

### ❓ What is SameSite?

> Protects against CSRF attacks

---

### ❓ When is session created?

> On first request (not just login)

---

### ❓ When is session deleted?

* On expiry (7 days)
* Or manually using `req.session.destroy()`

---

# 🚪 4. Logout

### ❓ What happens during logout?

```js
req.logout();
req.session.destroy();
res.clearCookie("connect.sid");
```

---

### ❓ Why is `req.logout()` not enough?

> It only removes user, not the session from DB

---

# 🛡️ 5. Authorization

### ❓ How do you protect routes?

Using middleware:

```js
isLoggedIn
```

---

### ❓ What is `req.isAuthenticated()`?

> Checks if user is logged in

---

### ❓ How do you restrict resource ownership?

* `isOwner` → listing owner
* `isReviewAuthor` → review author

---

# 🔁 6. Redirect After Login

### ❓ How do you redirect user after login?

```js
req.session.redirectUrl = req.originalUrl;
```

---

# ⚙️ 7. MongoDB Session Store

### ❓ Why use MongoDB for sessions?

* Persistent storage
* Scalable
* Works across servers

---

### ❓ What is TTL index?

> Automatically deletes expired sessions

---

# ⚖️ 8. JWT vs Sessions

### ❓ Why not JWT?

> Sessions are simpler and better for server-rendered apps

---

### ❓ Difference between JWT and sessions?

| Feature  | Session   | JWT    |
| -------- | --------- | ------ |
| Storage  | Server/DB | Client |
| Stateful | Yes       | No     |
| Logout   | Easy      | Hard   |

---

# 🔥 9. Security Questions

### ❓ What is Session Fixation?

> Attacker forces user to use known session ID

✔ Solution:

```js
req.session.regenerate()
```

---

### ❓ What is XSS?

> Injecting malicious JavaScript

✔ Prevention:

* HttpOnly cookies
* Input sanitization

---

### ❓ What is CSRF?

> Unauthorized requests using user session

✔ Prevention:

* SameSite cookies
* CSRF tokens

---

### ❓ What happens if cookie is stolen?

> Attacker can impersonate the user

---

# 🧠 10. Advanced Questions

### ❓ Why not store session in memory?

* Lost on restart
* Not scalable

---

### ❓ How would you scale this system?

* Use Redis store
* Load balancing

---

### ❓ Can multiple servers share sessions?

> Yes, using shared DB like MongoDB

---

# ⚠️ 11. Tricky Questions

### ❓ Is session created before login?

> Yes

---

### ❓ Does logout delete session?

> No (unless explicitly destroyed)

---

### ❓ Where is password stored?

> Hashed + salted (passport-local-mongoose)

---

### ❓ Can session cookie be decoded?

> No, it only contains session ID

---

### ❓ Is JWT always better?

> No, depends on use case

---

# 🎤 Final Interview Answer (Use This!)

> “I implemented session-based authentication using Passport.js with Local Strategy. User passwords are hashed securely using passport-local-mongoose. After login, only the user ID is stored in a MongoDB-backed session using connect-mongo, and the browser stores a session ID in an HttpOnly cookie. On each request, Passport deserializes the user and attaches it to req.user. I also implemented authorization middleware like isLoggedIn and isOwner to protect routes. I chose sessions over JWT because my app is server-rendered, making sessions simpler, more secure, and easier to manage.”

---

# 🚀 Tip

Focus on:

* Flow clarity
* Security reasoning
* Why decisions were made

That’s what interviewers care about most.

---
