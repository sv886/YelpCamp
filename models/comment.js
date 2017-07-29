var mongoose = require("mongoose");
// Create schema for comment
var commentSchema = new mongoose.Schema({
  text: String,
  author: String
});

module.exports = mongoose.model("Comment", commentSchema);
