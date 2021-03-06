var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

// Array will be used to create campground objects in #seedDB
var data = [
    {
      name: "Rocky Top",
      image: "https://www.fs.usda.gov/Internet/FSE_MEDIA/stelprdb5259404.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet fermentum est, sit amet bibendum dui iaculis a. Phasellus tempor enim nunc, et ultrices lectus suscipit non. Fusce laoreet scelerisque tincidunt. Pellentesque purus tortor, gravida pulvinar nibh id, ullamcorper commodo arcu. Donec tempus neque ac dolor blandit tincidunt. Donec non ex eu sapien pretium vestibulum non sit amet erat. Maecenas faucibus sapien eget elit porttitor aliquet."
    },
    {
      name: "Picnic Peak",
      image: "http://www.dec.ny.gov/images/permits_ej_operations_images/kennethwilsonpav.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet fermentum est, sit amet bibendum dui iaculis a. Phasellus tempor enim nunc, et ultrices lectus suscipit non. Fusce laoreet scelerisque tincidunt. Pellentesque purus tortor, gravida pulvinar nibh id, ullamcorper commodo arcu. Donec tempus neque ac dolor blandit tincidunt. Donec non ex eu sapien pretium vestibulum non sit amet erat. Maecenas faucibus sapien eget elit porttitor aliquet."
    },
    {
      name: "Mosquito Mountain",
      image: "https://www.threeriversparks.org/sites/default/files/2017-03/CL_camping_Billboard_01.jpg",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus imperdiet fermentum est, sit amet bibendum dui iaculis a. Phasellus tempor enim nunc, et ultrices lectus suscipit non. Fusce laoreet scelerisque tincidunt. Pellentesque purus tortor, gravida pulvinar nibh id, ullamcorper commodo arcu. Donec tempus neque ac dolor blandit tincidunt. Donec non ex eu sapien pretium vestibulum non sit amet erat. Maecenas faucibus sapien eget elit porttitor aliquet."
    }
]

function seedDB(){
  // Remove all campgrounds
  Campground.remove({}, function(err){
    if(err) {
      console.log("error clearing db of campgrounds");
    }
    console.log("removed campgrounds");
    // Add campgrounds using data array
    data.forEach(function(seed){
      Campground.create(seed, function(err, campground){
        if(err) {
          console.log(err);
        } else {
          console.log("added a campground");
          // Create a comment associated with each campground
          Comment.create(
            {
              text: "apasiwate",
              author: "Chapulín"
          }, function(err, comment){
            if(err) {
              console.log(err);
            } else {
              campground.comments.push(comment);
              campground.save();
              console.log("created comment!");
            }
          });
        }
      });
    });
  });
}

module.exports = seedDB;
