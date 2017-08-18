//#########################################################
//
// Middleware
//
//#########################################################
var Comment       = require("../models/comment");
var Campground    = require("../models/campground");
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err) {
        req.flash("error", "Campground not found.");
        // sends user back to last successful request
        res.redirect("back");
      } else {
        // Note that if(foundCampground.author.id === req.user._id) is
        // actually mongooseObject === String evaluation and will not work.
        // Use mongoose's #equals method to accomplish auth check.
        if(foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Halt! Who goes there? Access denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "User must be logged in.");
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
  // is user logged in?
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err) {
        req.flash("error", "Comment not found.");
        // sends user back to last successful request
        res.redirect("back");
      } else {
        // Note that if(foundComment.author.id === req.user._id) is
        // actually mongooseObject === String evaluation and will not work.
        // Use mongoose's #equals method to accomplish auth check.
        if(foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash("error", "Halt! Who goes there? Access denied.");
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash("error", "User must be logged in.");
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "User must be logged in.");
  res.redirect("/login");
}



module.exports = middlewareObj;
