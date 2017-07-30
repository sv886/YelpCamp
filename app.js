//#########################################################
//
// Setup
//
//#########################################################
var express       = require("express"),
    app           = express(),
    bodyParser    = require("body-parser"),
    mongoose      = require("mongoose"),
    passport      = require("passport"),
    LocalStrategy = require("passport-local"),
    Campground    = require("./models/campground"),
    Comment       = require("./models/comment"),
    User          = require("./models/user")
    seedDB        = require("./seeds")

// Connect to yelp_camp db (initial run will create db)
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();



//#########################################################
//
// Passport Config
//
//#########################################################
app.use(require("express-session")({
  secret: "SsshHHhhhHHhhhHHHhhh",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//#########################################################
//
// Routes
//
//#########################################################
app.get("/", function(req, res){
  res.render("landing");
});

// Index
app.get("/campgrounds", function(req, res){
  // Get all campgrounds from db
  Campground.find({}, function(err, allCampgrounds){
    if(err) {
      console.log(err);
    } else {
      // render campgrounds ejs template with data retrieved from db
      res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
    }
  });
});

// Create
app.post("/campgrounds", function(req, res){
  // get data from form
  var campgroundName = req.body.name;
  var campgroundImage = req.body.image;
  var campgroundDescription = req.body.description;
  var newCampground =
    {
      name: campgroundName,
      image: campgroundImage,
      description: campgroundDescription
    };
  // Create a new campground and save to db
  Campground.create(newCampground, function(err, newlyCreated){
    if(err) {
      console.log(err);
    } else {
      // redirect to campgrounds index
      // NOTE two /campgrounds routes, #redirect defaults to redirect as a GET request
      res.redirect("/campgrounds");
    }
  })

});

// New
app.get("/campgrounds/new", function(req, res){
  res.render("campgrounds/new");
});

// Show (Must follow new or new will be treated as an id in URL rendering show)
app.get("/campgrounds/:id", function(req,res){
  // find campground with provided id, populate associated comments, then
  // execute query
  Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
    if(err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render("campgrounds/show", {campground: foundCampground});
    }
  });
});

// Comments Routes ========================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
  // lookup campground using id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log("Error finding campground during comment post");
    } else {
      // create new comment
      Comment.create(req.body.comment, function(err, comment){
        if(err) {
          console.log("Error creating comment during comment post");
        } else {
          // connect new comment
          campground.comments.push(comment);
          // save updated campground
          campground.save();
          // redirect to show
          res.redirect("/campgrounds/" + campground._id);
        }
      });
    }
  });
});

// Auth Routes ========================================
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

//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
