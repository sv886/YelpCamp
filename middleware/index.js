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
        // sends user back to last successful request
        res.redirect("back");
      } else {
        // Note that if(foundCampground.author.id === req.user._id) is
        // actually mongooseObject === String evaluation and will not work.
        // Use mongoose's #equals method to accomplish auth check.
        if(foundCampground.author.id.equals(req.user._id)) {
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

middlewareObj.checkCommentOwnership = function(req, res, next){
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

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash("error", "Please login first.");
  res.redirect("/login");
}



module.exports = middlewareObj;
