//#########################################################
//
// Setup
//
//#########################################################
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose"),
    Campground = require("./models/campground"),
    seedDB     = require("./seeds")

seedDB();
// Connect to yelp_camp db (initial run will create db)
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");



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
      res.render("campgrounds/index", {campgrounds: allCampgrounds});
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
app.get("/campgrounds/:id/comments/new", function(req, res){
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
