var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Root
router.get("/", function(req, res){
  res.render("landing");
});

// Register
router.get("/register", function(req, res){
  res.render("register");
});

router.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  // Passport's #register will save new user obj and hashed password
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      req.flash("error", err.message);
      return res.render("register");
    }
    // Login user, authenticate and redirect
    passport.authenticate("local")(req, res, function(){
      req.flash("success", "Welcome to Yelpcamp, " + user.username + "!")
      res.redirect("/campgrounds");
    });
  });
});

// Login
router.get("/login", function(req, res){
  res.render("login");
});

// app.post("login", middleware(passport authenticates form input againts db values), callback)
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
    // middleware handling routing above
});

// Logout
router.get("/logout", function(req, res){
  // Simple one-liner with passport
  req.logout();
  req.flash("success", "Logged you out.");
  res.redirect("campgrounds");
});

module.exports = router;
