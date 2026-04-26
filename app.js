if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");
const aiRouter = require("./routes/ai.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


//Mongoose and MongoDB connection
//let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
let ATLAS_URL=process.env.ATLAS_DB_URL;
module.exports=ATLAS_URL;

main()
  .then(() => console.log("Connected to database!"))
  .catch(() => console.log("unable to connect to database"));

async function main() {
  await mongoose.connect(ATLAS_URL);
}

//Setting ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //req.body read
app.use(methodOverride("_method")); //patch and delete
app.use(express.static(path.join(__dirname, "/public")));//to serve static files 

app.engine("ejs", ejsMate); //layouts

//first we were storing sessions on server but now we will store session in cloud- mongo
let store;
try {
  store = MongoStore.create({
    mongoUrl: ATLAS_URL,
    crypto: { secret: process.env.EXPRESS_SESSION_SECRET },//to verify secret 
    touchAfter: 24 * 3600,
  });
} catch (err) {
  console.log("Session store failed—using fallback memory store ");
}

const sessionOptions = { 
  store:store,
  secret: process.env.EXPRESS_SESSION_SECRET,//Adds encryption for session data stored in MongoDB.
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//7 days max expiry
    maxAge: 1000 * 60 * 60 * 24 * 7, 
    httpOnly: true,
    sameSite: "strict"
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//setup passport middleware
app.use(passport.session());//integrates with express-session
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//After login, Passport stores the user’s ID in the session (not the whole user object).this ID is what gets written into the encrypted session  in MongoDB
passport.deserializeUser(User.deserializeUser());//On each request, Passport takes the user ID from the session, looks up the full user in MongoDB, and attaches it to req.user.

// app.get("/demoUser",async (req,res)=>
// {
//    let fakeUser=new User({
//     username:"demoStudent1",
//     email:"demoStudent1@gmail.com"
//    });
//    let registeredUser=await User.register(fakeUser,"demoPass1");//created in db
//    res.send(registeredUser);
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  // console.log(res.locals.success);
  next();
});

app.get('/', (req, res) => {
  res.redirect('/listings'); // or res.render('explore') if using EJS
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);
app.use("/", aiRouter);   // ← ADD THIS

//for all other routes that does not match
app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error.ejs", { message });
});

//test server
app.listen(8080, () => {
  console.log("sever is listening to port 8080");
});

//the country valid cannot be a no
//multi photo uplaod for a listing 
//delteing from cloudimary as listing gets deleted
//limiting size of image upload
//anyone can send req from hoppscoth , to create listing without image this will throew error


/*
Session ID created immediately when a client connects.
Stored in both client cookie and MongoDB session store.
After login, Passport updates that same session with user identity (passport.user).
Logout removes the user from the session, but the session ID/cookie can still exist until expiry or destruction.

Client sends request with cookie connect.sid.
Express-session verifies the signature using your secret.
If valid, it extracts the raw ID (pDMMLYOwBnm99C-FuZ1X9gj5vB1qBjdj).
That raw ID is used to look up the session document in MongoDB.
The stored session data is loaded into req.session.
Cookie stolen → impersonation until expiry.
Secret leaked → attackers can forge cookies indefinitely.
DB leaked → attackers see session data; impersonation possible if combined with cookie/secret.

xpress-session and Passport work together in your app (and how that ties into what you’re seeing in MongoDB Atlas):

Express-session
Creates a session ID cookie (connect.sid) for each client.
Stores the actual session data in MongoDB (via connect-mongo).
The cookie only contains the signed session ID; the DB holds the encrypted session object.

Passport
Handles authentication (login with username/password).
After login, Passport calls:
serializeUser → stores the user’s ID in the session object (passport.user).
deserializeUser → retrieves the user’s full record from MongoDB on each request, using that ID.

Login request
User submits credentials.
Passport verifies them via LocalStrategy(User.authenticate()).
If valid, Passport calls serializeUser → user ID is added to the session object.

Session storage
Express-session saves that session object in MongoDB Atlas.
The session field you saw ("MIICYwSCAQhY...") is the encrypted blob containing passport.user, cookie metadata, and flash messages.

Subsequent requests
Browser sends the connect.sid cookie.
Express-session verifies it and loads the session object from MongoDB.
Passport runs deserializeUser → looks up the user by ID and attaches it to req.user.

In your Atlas tab, the sessions collection shows documents like:
json
{
  "_id": "3DHicHPqa0eNxoT3AEaZTbdAc8phZf99",
  "expires": "2026-02-15T23:51:43.082Z",
  "lastModified": "2026-02-08T23:51:43.082Z",
  "session": "MIICYwSCAQhYdi9YV2ErcEsxSWQwRFIrUCsyemJM..."
}
_id → raw session ID (linked to your cookie).
session → encrypted JSON with passport.user (your logged-in user’s ID).
expires → when the session will be invalidated.

Express-session manages the cookie + DB storage.
Passport plugs into that session, storing only the user ID.
On each request, Express-session restores the session, and Passport rehydrates req.user from the DB.

the reason session-based authentication uses cookies rather than local storage comes down to security and how the browser handles them.

Why cookies are used
Automatic sending:
Cookies are automatically sent with every HTTP request to the server. This makes them perfect for session IDs, because the server doesn’t need extra client-side code to attach them — the browser does it by default.

HttpOnly flag:
Cookies can be marked HttpOnly, which means JavaScript running in the browser cannot read or modify them. This protects against XSS (cross-site scripting) attacks.
Local storage, on the other hand, is always accessible to JavaScript, so if your site has an XSS vulnerability, attackers can steal tokens from local storage.

SameSite and Secure flags:
Cookies support SameSite and Secure attributes, which help mitigate CSRF (cross-site request forgery) and ensure cookies are only sent over HTTPS. Local storage doesn’t have these built-in protections.

Integration with express-session:
Libraries like express-session are designed to use cookies to hold the session ID (connect.sid). The actual session data lives in your server-side store (MongoDB in your case). Local storage wouldn’t integrate naturally with this flow.

Why not local storage?
Manual handling: You’d need to write client-side code to read from local storage and attach the token to every request (usually in headers). Cookies do this automatically.
Security risk: Local storage is vulnerable to XSS. If malicious JavaScript runs on your page, it can grab the token and impersonate the user.
No built-in expiry/flags: Local storage doesn’t support HttpOnly, SameSite, or automatic expiry tied to the browser session.
*/