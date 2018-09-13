// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var path = require("path");
var bodyParser=require('body-parser')
var exphbs = require("express-handlebars");
// Initialize Express
var app = express();
app.use(express.static("public"));
// Middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// Handlebars
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Main route (simple Hello World Message)
app.get("/", function(req, res) {
  res.render('index');
});



app.get("/api/search/:search", function(req,res){

  query1 = 'https://thepiratebay3.org/index.php?q='+req.params.search+'&page=0&orderby=99';
  request(query1, function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
  
    // An empty array to save the data that we'll scrape
    var results = [];
  
    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("a.detLink").each(function(i, element) {
  
      var link = $(element).attr("href");
      var title = $(element).attr("title");
      
      // Save these results in an object that we'll push into the results array we defined earlier
      results.push({
        title: title,
        link: link
      });
    });
  
    // Log the results once you've looped through each of the elements found with cheerio
    res.json({data: results});
  
  

  
  });
  


})


app.post("/api/getTorrent",function(req,res){
  console.log(req.body)
  query2=req.body.link;
  request(query2, function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
  
    // An empty array to save the data that we'll scrape
    var results = [];
  
  
    $("a").each(function(i,element){
      if($(element).attr("title")=="Get this torrent"){
        var link = $(element).attr("href");
        results.push(link);
      }

    })

    res.json({data:results});

})

});


// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
})
