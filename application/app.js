const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const path = require('path');
const $ = require('jQuery');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

const lesson = require('./routes/lesson.route'); // Imports routes for the lesson
const example = require('./routes/example.route'); // Imports routes for the example
const language = require('./routes/language.route'); // Imports routes for the language

let languagesDD = [];

const app = express();

app.engine('hbs', hbs({ extname: 'hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views/layouts/'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static('./'));
app.use('/lessons', lesson);
app.use('/examples', example);
app.use('/languages', language);

//console.log("++++++++++++++ : " + languagesDD);
function getLanguage() {
  xhr.open('GET', 'http://localhost:81/languages/get');
  xhr.onload = function() {
      if (xhr.status === 200) {
          languagesDD = xhr.responseText;
          languagesDD = JSON.parse(languagesDD);
          //console.log('*********************************');
          //console.log('language array: ' + languagesDD);
      } else {
          console.log('Request failed.  Returned status of ' + xhr.status);
      }
  };
  xhr.send();
}

//** ROUTING **//
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/newlanguage', function(req, res) {
  res.render('newlanguage');
});
app.get('/viewlanguage', function(req, res) {
  res.render('viewlanguage');
});

app.get('/newlesson', function(req, res) {
  getLanguage();
  res.render('newlesson', { url: req.url, title : "Lessons", languagesDD: languagesDD});
});


app.get('/example', function(req, res) {
  getLanguage();
  res.render('example', { url: req.url, title : "Examples", languagesDD: languagesDD});
});

//** DB CONNECTION **//
const mongoose = require('mongoose');
let dev_db_url = 'mongodb://dummyuser:1234abcd@ds157844.mlab.com:57844/w3schools';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));




app.get('/', function (req, res) {
    if (req.accepts('html')) {
      res.render('index', { url: req.url, title : "w3school Assessment"});
      return;
    }
});

app.get('/lesson', function (req, res) {
    if (req.accepts('html')) {
      res.render('index', { url: req.url, title : "w3school Assessment"});
      return;
    }
});

//** 404 **//
app.use(function(req, res, next) {
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url, title : "404"});
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});





let port = 81;

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
    console.log('----------------------------------- ');
});
