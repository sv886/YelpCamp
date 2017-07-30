var mongoose = require("mongoose");
// Create schema for user
var userSchema = new mongoose.Schema({
  username: String,
  password: String
});

module.exports = mongoose.model("User", userSchema);
