var mongoose = require("mongoose");
// Create schema for campground
var campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

// Compile into model, naming convention is to capitalize model name,
// CRUD methods available once model is defined
// Think of #module.exports as a sort of return on the model that
// makes model available when required in other files(app.js).
module.exports = mongoose.model("Campground", campgroundSchema);
