var mongoose = require("mongoose");
// Create schema for campground
var campgroundSchema = new mongoose.Schema({
  name: String,
  price: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    username: String
  },
  // Establish model association. The comments attribute will be
  // an array of comment object IDs.
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment"
    }
  ]
});

// Compile into model, naming convention is to capitalize model name,
// CRUD methods available once model is defined
// Think of #module.exports as a sort of return on the model that
// makes model available when required in other files(app.js).
module.exports = mongoose.model("Campground", campgroundSchema);
