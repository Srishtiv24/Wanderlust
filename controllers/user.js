const User = require("../models/user.js");

module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signup=async (req, res,next) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });//username schema added by passport 
      let registeredUser = await User.register(newUser, password);//passport
      console.log(registeredUser);
      req.login(registeredUser,((err)=>//passport method
      { if(err){ next(err)}
      req.flash("success", "Welcome to WanderLust !");
      res.redirect("/listings");
    }));
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  }

module.exports.renderLoginForm= (req, res) => {
    res.render("users/login.ejs");
  }

module.exports.login=async (req, res) => { //app.js -serialize & deserilaize user are ofr login part 
    req.flash("success", "Welcome back to Wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  }

  module.exports.logout = (req, res, next) => {
    req.logout((err) => { //passposrt method
      if (err) return next(err);
  
      //  Destroy session from MongoDB
      req.session.destroy((err) => {
        if (err) return next(err);
  
        // Clear cookie from browser
        res.clearCookie("connect.sid");
  
        req.flash("success", "Successfully logged out!");
        res.redirect("/listings");
      });
    });
  };

  /*
When a user logs in via Passport (passport.authenticate("local")), Passport verifies their credentials.
If successful, Passport serializes the user into the session and attaches them to req.user.

That’s why, after login, you can access the logged-in user as req.user in any route.
  passport has already attached the user to req.user before this function runs.  
  don’t need to manually handle it here — you just flash a success message and redirect.
  */