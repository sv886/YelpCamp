// Root
app.get("/", function(req, res){
  res.render("landing");
});

// Register
app.get("/register", function(req, res){
  res.render("register");
});

app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username});
  // Passport's #register will save new user obj and hashed password
  User.register(newUser, req.body.password, function(err, user){
    if(err) {
      console.log(err);
      return res.render("register");
    }
    // Login user, authenticate and redirect
    passport.authenticate("local")(req, res, function(){
      res.redirect("/campgrounds");
    });
  });
});

// Login
app.get("/login", function(req, res){
  res.render("login");
});

// app.post("login", middleware(passport authenticates form input againts db values), callback)
app.post("/login", passport.authenticate("local",
  {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
  }), function(req, res){
    // middleware handling routing above
});

// Logout
app.get("/logout", function(req, res){
  // Simple one-liner with passport
  req.logout();
  res.redirect("campgrounds");
});

// define login check middleware function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}
