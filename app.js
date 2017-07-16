//#########################################################
//
// Setup
//
//#########################################################
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

// temp global campgrounds array
var campgrounds = [
  {name: "Salmon Creek", image: "http://www.hike-nh.com/faq/safety/bear.jpg"},
  {name: "Granite Hill", image: "http://hikethewhites.com/tarryhoweekend/fw04.jpg"},
  {name: "Mount Moody", image: "http://www.dec.ny.gov/images/permits_ej_operations_images/kennethwilsonpav.jpg"},
  {name: "Schweady Lake", image: "http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/10/main/hoodview-campground-0510.jpg?itok=B8Eb65Uf"}
];

//#########################################################
//
// Routes
//
//#########################################################
app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
  // get data from form and add to campgrounds array
  var campgroundName = req.body.name;
  var campgroundImage = req.body.image;
  var newCampground = {name: campgroundName, image: campgroundImage};
  campgrounds.push(newCampground);

  // redirect to campgrounds index
  // NOTE two /campgrounds routes, #redirect defaults to redirect as a GET request
  res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
  res.render("new");
});

//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
