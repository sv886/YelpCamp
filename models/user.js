var mongoose = require("mongoose");
// Add in passport-local plugin
var passportLocalMongoose = require("passport-local-mongoose");
// Create schema for user
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

// Make passport methods available to our User model
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
