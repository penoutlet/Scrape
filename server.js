/* Showing Mongoose's "Populated" Method (18.3.8)
 * INSTRUCTOR ONLY
 * =============================================== */

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs= require("express-handlebars");
// Requiring our Note and Article models
var Note = require("./models/Comment.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));
//handlebars boilerplate
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18day3mongoose"); 
 


  // "mongodb://heroku_q2t4tfn9:c8qdj6a6e5i8s0a8gg8leinjoa@ds149491.mlab.com:49491/heroku_q2t4tfn9");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  request("http://www.nytimes.com/", function(error, response, html) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(html);
    // Now, we grab every h2 within an article tag, and do the following:
    $("h2.story-heading").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this).text();
      result.link = $(element).children().attr("href");
      // console.log(JSON.stringify(result[0]));
      // Using our Article model, create a new entry
      var entry = new Article (result);

      entry.save(function(err,doc){
        if (err){
          console.log(err);
        }
        else {
          console.log((result));
        }
      });


    });
  res.send("Scrape Complete");
  });
  // Tell the browser that we finished scraping the text
// };

  // This will get the articles we scraped from the mongoDB

app.get("/", function(req,res){
  // Article.find({}, function(doc){
  //   console.log(doc);
    res.render("index");
  // });
});
  // Grab every doc in the Articles array
app.get("/articles", function(req, res){
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("comment")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newComment = new Comment(req.body);

//   // And save the new note the db
  newComment.save(function(error, doc) {
//     // Log any errors
    if (error) {
       console.log(error);
    }
//     // Otherwise
    else {
      // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
//       // Execute the above query
      .exec(function(err, doc) {
//         // Log any errors
        if (err) {
          console.log(err);
        }
        else {
//           // Or send the document to the browser
          res.send(doc);
        }
      });
    }
  });
});
});
console.log("Working");
// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});

