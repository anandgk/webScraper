var express = require('express');
var router = express.Router();
var request = require('request'); 
var Note = require('../models/Note.js');
var Article = require('../models/Article.js');
var mongoose = require('mongoose');
var cheerio = require('cheerio');

// mongoose.connect('mongodb://localhost/webScraper');
mongoose.connect('mongodb://heroku_cv8tbtls:43928hnnqg6bgbjf63hcop7elg@ds029456.mlab.com:29456/heroku_cv8tbtls');

var db = mongoose.connection;
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

db.once('open', function() {
  console.log('Connection to Mongoose Successful.');
});


router.get('/', function(req, res) {
  res.render('index');
});

router.get('/scrape', function(req, res) {
  request('http://www.npr.org/', function(error, response, html) {
    var $ = cheerio.load(html);
    $('article h1').each(function(i, element) {

				var result = {};

				result.title = $(this).parent('a').text();
				result.link = $(this).parent('a').attr('href');

				var entry = new Article (result);

				entry.save(function(err, doc) {
				  if (err) {
				    console.log(err);
				  } 
				  else {
				    console.log(doc);
				  }
				});


    });
  });
  res.render('scraped');
});

router.get('/articles', function(req, res){
	Article.find({}, function(err, doc){
		if (err){
			console.log(err);
		} 
		else {
			res.json(doc);
		}
	});
});

router.get('/articles/:id', function(req, res){
	Article.findOne({'_id': req.params.id})
	.populate('note')
	.exec(function(err, doc){
		if (err){
			console.log(err);
		} 
		else {
			res.json(doc);
		}
	});
});

router.post('/removenote/:id', function(req, res) {
    console.log(req.params.id);
    Note.findOne({ '_id': req.params.id })
        .remove('note')
        .exec(function(err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(doc);
            }
        });
});


router.post('/articles/:id', function(req, res){
	var newNote = new Note(req.body);

	newNote.save(function(err, doc){
		if(err){
			console.log(err);
		} 
		else {
			Article.findOneAndUpdate({'_id': req.params.id}, {'note':doc._id})
			.exec(function(err, doc){
				if (err){
					console.log(err);
				} else {
					res.send(doc);
				}
			});
		}
	});
});

module.exports = router;