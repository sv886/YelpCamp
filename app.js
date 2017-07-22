//#########################################################
//
// Setup
//
//#########################################################
var express    = require("express"),
    app        = express(),
    bodyParser = require("body-parser"),
    mongoose   = require("mongoose")

// Connect to yelp_camp db (initial run will create db)
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

//#########################################################
//
// Schema
//
//#########################################################
// Create schema for campground
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// Compile into model, naming convention is to capitalize model name,
// CRUD methods available once model is defined
var Campground = mongoose.model("Campground", campgroundSchema);



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
      res.render("index", {campgrounds: allCampgrounds});
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
  res.render("new");
});

// Show (Must follow new or new will be treated as an id in URL rendering show)
app.get("/campgrounds/:id", function(req,res){
  // find campground with provided id
  Campground.findById(req.params.id, function(err, foundCampground){
    if(err) {
      console.log(err);
    } else {
      // render show template with that campground
      res.render("show", {campground: foundCampground});
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
