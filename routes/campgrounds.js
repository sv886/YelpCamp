var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

// Index
router.get("/", function(req, res){
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

// New
router.get("/new", isLoggedIn, function(req, res){
  res.render("campgrounds/new");
});

// Create
router.post("/", isLoggedIn, function(req, res){
  // get data from form
  var campgroundName = req.body.name;
  var campgroundImage = req.body.image;
  var campgroundDescription = req.body.description;
  var campgroundAuthor = {
    id: req.user._id,
    username: req.user.username
  };
  var newCampground = {
    name: campgroundName,
    image: campgroundImage,
    description: campgroundDescription,
    author: campgroundAuthor
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

// Show (Must follow new or new will be treated as an id in URL rendering show)
router.get("/:id", function(req, res){
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

// Edit
router.get("/:id/edit", function(req, res){
  // is user logged in?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
        res.redirect("/campgrounds");
      } else {
        // does user own the campground?
        // Note that if(foundCampground.author.id === req.user._id) is
        // actually mongooseObject === String evaluation and will not work.
        // Use mongoose's #equals method to accomplish auth check.
        if(foundCampground.author.id.equals(req.user._id)) {
          res.render("campgrounds/edit", {campground: foundCampground});
        } else {
          res.send("sry access denied");
        }
      }
    });
  } else {
    // if not, redirect
    console.log("plz login plz");
    res.send("plz login plz");
  }
});

// Update
router.put("/:id", function(req, res){
  // find and update campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
    if(err) {
      res.redirect("/campgrounds");
    } else {
      // redirect on successful edit
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});

// Destroy
router.delete("/:id", function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err){
    if(err) {
      res.redirect("/campgrounds");
    } else {
      console.log("deleted the campground")
      res.redirect("/campgrounds");
    }
  });
});

// define login check middleware function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
