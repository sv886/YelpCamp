//#########################################################
//
// Setup
//
//#########################################################
var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
    passport       = require("passport"),
    flash          = require("connect-flash"),
    LocalStrategy  = require("passport-local"),
    methodOverride = require("method-override")

// Models/Seeds
var Campground = require("./models/campground"),
    Comment    = require("./models/comment"),
    User       = require("./models/user"),
    seedDB     = require("./seeds")

// Routes
var indexRoutes      = require("./routes/index"),
    commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds")

// Connect to yelp_camp db (initial run will create db)
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();



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

// Make currentUser available in every route
app.use(function(req, res, next){
  // #res.locals will pass currentUser into all templates
  res.locals.currentUser = req.user;
  // Make sure to add #next to continue on to next middleware
  // which is the route handler in most cases
  next();
});

// Use required route files
// NOTE placement order is important here, must declare use
// after currentUser code above to avoid 'esc is not a function' error.
app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds", campgroundRoutes);



//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
