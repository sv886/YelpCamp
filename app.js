//#########################################################
//
// Setup
//
//#########################################################
var express = require("express");
var app = express();



//#########################################################
//
// Routes
//
//#########################################################
app.get("/", function(req, res){
  res.send("This will be the landing page.");
});



//#########################################################
//
// Server
//
//#########################################################
app.listen(3000, function(){
  console.log("running on port 3stacks");
});
