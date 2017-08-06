var express = require("express");
// Merge params to access parent params in nested routes
// ex: campground id in new comment view /campgrounds/:id/comments/new
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// New
router.get("/new", isLoggedIn, function(req, res){
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

// Create
router.post("/", isLoggedIn, function(req, res){
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

// define login check middleware function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = router;
