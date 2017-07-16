//#########################################################
//
// Setup
//
//#########################################################
var express = require("express");
var app = express();

app.set("view engine", "ejs");



//#########################################################
//
// Routes
//
//#########################################################
app.get("/", function(req, res){
  res.render("landing");
});

app.get("/campgrounds", function(req, res){
  // temp campgrounds array
  var campgrounds = [
    {name: "Salmon Creek", image: "http://www.hike-nh.com/faq/safety/bear.jpg"},
    {name: "Granite Hill", image: "http://hikethewhites.com/tarryhoweekend/fw04.jpg"},
    {name: "Mount Moody", image: "http://www.dec.ny.gov/images/permits_ej_operations_images/kennethwilsonpav.jpg"},
    {name: "Schweady Lake", image: "http://img1.sunset.timeinc.net/sites/default/files/styles/1000x1000/public/image/2016/10/main/hoodview-campground-0510.jpg?itok=B8Eb65Uf"}
  ];

  res.render("campgrounds");
});

//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
