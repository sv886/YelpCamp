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
          // add username and user id to comment
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();
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

// Edit
router.get("/:comment_id/edit", checkCommentOwnership, function(req, res){
  Comment.findById(req.params.comment_id, function(err, foundComment){
    if(err) {
      console.log("Error finding comment");
      res.redirect("back");
    } else {
      res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
    }
  });
});

// Update
router.put("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id );
    }
  });
});

// Destroy
router.delete("/:comment_id", checkCommentOwnership, function(req, res){
  Comment.findByIdAndRemove(req.params.comment_id, function(err){
    if(err) {
      res.redirect("back");
    } else {
      res.redirect("/campgrounds/" + req.params.id);
    }
  });
});



//#########################################################
//
// Middleware
//
//#########################################################
// define login check middleware function
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

function checkCommentOwnership(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        // sends user back to last successful request
        res.redirect("back");
      } else {
        // Note that if(foundComment.author.id === req.user._id) is
        // actually mongooseObject === String evaluation and will not work.
        // Use mongoose's #equals method to accomplish auth check.
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    res.redirect("back");
  }
}

module.exports = router;
