// dependencies
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var exphbs  = require('express-handlebars');

// Handlebars
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// use morgan and bodyparser with our app
app.use(bodyParser.urlencoded({
  extended: false
}));

// make public a static dir
app.use(express.static('public'));

var routes = require('./controllers/controller.js');
app.use('/', routes);

var PORT = process.env.PORT || 3001;
app.listen(PORT, function(){
  console.log("listening on port: "+ PORT);
});
