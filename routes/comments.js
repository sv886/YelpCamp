var express = require("express");
var router = express.Router();

router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
  // Find campground by id
  Campground.findById(req.params.id, function(err, campground){
    if(err) {
      console.log(err)
    } else {
      res.render("comments/new", {campground: campground});
    }
  });
});

router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
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

module.exports = router;
