const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.set("view engine", "ejs");

app.use(express.static("Public"));

//Setting mongo db connection
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//creating our collection schema
const articleSchema = {
  title: String,
  content: String
}
//creating article model
const Article = mongoose.model("Article", articleSchema);

//TODO code:
// Requests targeting all articles
app.route("/articles")
  .get(function(req, res) {
    Article.find(function(err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function(req, res) {
    //create data in our MongoDB database
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send("Successfully added the new article");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) {
        res.send("Successfully deleted");
      } else {
        res.send(err);
      }
    })
  });

// Request targets a specific article

app.route("/articles/:articleTitle")
    .get(function(req,res){

      Article.findOne(
        {title:req.params.articleTitle},
        function(err,foundArticle){
          if(foundArticle){
            res.send(foundArticle);
          }else{
            res.send("No articles matching that title was found");
          }
        });
    })
    .put(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {title:req.body.title,content:req.body.content},
        {overwrite: true},
        function(err){
          if(!err){
            res.send("Successfully updated article");
          }
        }
      )
    })
    .patch(function(req,res){
      Article.update(
        {title:req.params.articleTitle},
        {$set: req.body},
        function(err){
          if(!err){
            res.send("Successfully updated article");
          }else{
            res.send(err);
          }
        }
      )
    })
    .delete(function(req,res){
      Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
          if(!err){
            res.send("Successfully deleted the article");
          }else{
            res.send(err);
          }
        }
      )
    });





app.listen(3000, function() {
  console.log("Server started on port 3000");
});



/*RESTful table how to GET(HTTP verb)
app.get("/articles", );

//RESTful table how to POST(HTTP verb)
app.post("/articles",);

//RESTful table how to delete(HTTP verb)
app.delete("/articles",);*/
