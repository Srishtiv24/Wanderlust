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
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const {initDB}=require("./init/index.js");

//Mongoose and MongoDB connection
//let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
let ATLAS_URL=process.env.ATLAS_DB_URL;

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
app.use(express.urlencoded({ extended: true })); //req.body read
app.use(methodOverride("_method")); //patch and delete
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate); //layouts

//first we were storing on local store but now we will store session in cloud- mongo
const store= MongoStore.create({
  mongoUrl:ATLAS_URL,
  crypto:{ 
      secret: process.env.EXPRESS_SESSION_SECRET,
         },
   touchAfter:  24*3600  ,//session updates automatically after
})

store.on("error",()=>{
  console.log("Error on Mongo Session Store",err);
});

const sessionOptions = { 
  store:store,
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,//7 days max expiry
    maxAge: 1000 * 60 * 60 * 24 * 7, 
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", usersRouter);

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