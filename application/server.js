const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');

//** AUTH0 - BEGIN**//
const session = require('express-session');
const passport = require('passport');
const Auth0Strategy = require('passport-auth0');

const authVar = {
  domain: 'w3school-assesment.eu.auth0.com',
  clientID: 'NsMiNyhvTME1GylJNizfm12J78QOIqD7',
  clientSecret: 'vXq0eMpHYMPzkSwN_a8gVoCL4NiyHGiZCCeRZVf7jvbvbAaB9XGMboMovZ3VNZEP',
  callbackURL: 'http://localhost:81/callback'
}

const strategy = new Auth0Strategy (
  {
    domain: 'w3school-assesment.eu.auth0.com',
    clientID: 'NsMiNyhvTME1GylJNizfm12J78QOIqD7',
    clientSecret: 'vXq0eMpHYMPzkSwN_a8gVoCL4NiyHGiZCCeRZVf7jvbvbAaB9XGMboMovZ3VNZEP',
    callbackURL: 'http://localhost:81/callback'
  },
  function(accessToken, refreshToken, extraParam, profile, done) {
    return done(null, profile);
  }
)

passport.use(strategy);

passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(user, done){
  done(null, user);
});
//** AUTH0 - END**//
const jwt = require('jsonwebtoken');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

const config = require('../config');
const User = require('./models/user');
const lesson = require('./routes/lesson.route'); // Imports routes for the lesson
const example = require('./routes/example.route'); // Imports routes for the example
const language = require('./routes/language.route'); // Imports routes for the language
const app = express();

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(
  session({
    secret: 'your_secret_key',
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(function (req, res, next) {
  res.locals.loggedIn = false;

  if(req.session.passport && typeof req.session.passport.user != 'undefined') {
    res.locals.loggedIn = true;
  }

  next();
});

//** ROUTING **//


let languagesDD = [];

app.get('/newlanguage', function(req, res) {
  res.render('newlanguage');
});
app.get('/viewlanguage', function(req, res) {
  getLanguage().then(function(){
    res.render('viewlanguage', {
      url: req.url,
      title: "Languages",
      languagesDD: languagesDD
    });
  });
});
app.get('/updatelanguage', function(req, res) {
  //getIndividualExample();
  res.render('updatelanguage', {
    url: req.url,
    title: "Languages"
  });
});

app.get('/newlesson', function(req, res) {
  getLanguage();
  res.render('newlesson', {
    url: req.url,
    title: "Lessons",
    languagesDD: languagesDD
  });
});
app.get('/viewlesson', function(req, res) {
  getLessons().then(function(){
    res.render('viewlesson', {
      url: req.url,
      title: "Lessons",
      lessons: lessons
    });
  });
});
app.get('/updatelesson', function(req, res) {
  getLanguage().then(function(){
  //getIndividualLesson();
  console.log("lesson :" + lesson);
  res.render('updatelesson', {
    url: req.url,
    title: "Lessons",
    languagesDD: languagesDD
  });
  });
});

app.get('/newexample', function(req, res) {
  getLanguage();
  res.render('newexample', {
    url: req.url,
    title: "Examples",
    languagesDD: languagesDD
  });
});
app.get('/viewexample', function(req, res) {
  getExamples();
  res.render('viewexample', {
    url: req.url,
    title: "Examples",
    examples: examples
  });
});
app.get('/updateexample', function(req, res) {
  //getIndividualExample();
  res.render('updateexample', {
    url: req.url,
    title: "Examples"
  });
});

//** GET LANGUAGES **//
function getLanguage() {
  return new Promise(function(resolve, reject) {
  xhr.open('GET', 'http://localhost:81/languages/get');
  xhr.onload = function() {
    if (xhr.status === 200) {
      languagesDD = xhr.responseText;
      languagesDD = JSON.parse(languagesDD);
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  resolve(xhr.send());
});
}
//** GET LESSONS **//
let lessons = [];

function getLessons() {
  return new Promise(function(resolve, reject) {
    xhr.open('GET', 'http://localhost:81/lessons/get');
    xhr.onload = function() {
      if (xhr.status === 200) {
        lessons = xhr.responseText;
        lessons = JSON.parse(lessons);
      } else {
        console.log('Request failed.  Returned status of ' + xhr.status);
      }
    };
    resolve(xhr.send());
  });
}

function getIndividualLesson(_id) {
  xhr.open('GET', 'http://localhost:81/lessons/' + _id);
  xhr.onload = function() {
    if (xhr.status === 200) {
      console.log('Lesson returned ' + xhr.responseText);
      lesson = xhr.responseText;
      lesson = JSON.parse(lesson);
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
}
//** GET EXAMPLES **//
let examples = [];

function getExamples() {
  xhr.open('GET', 'http://localhost:81/examples/get');
  xhr.onload = function() {
    if (xhr.status === 200) {
      examples = xhr.responseText;
      examples = JSON.parse(examples);
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
}


//** CONFIGURATION **//
let port = 81;
app.set('superSecret', config.secret);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

let dev_db_url = 'mongodb://dummyuser:1234abcd@ds157844.mlab.com:57844/w3schools';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(express.static('./'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/lessons', lesson);
app.use('/examples', example);
app.use('/languages', language);

//** BASIC ROUTING **//
app.get('/', function(req, res , next) {
  res.render('index', {
    url: req.url,
    title: "w3school Assessment"
  });
});

app.get('/login', passport.authenticate('auth0', {
  clientID: authVar.clientID,
  domain: authVar.domain,
  redirectUri: authVar.callbackURL,
  responseType: 'code',
  audience: 'https://w3school-assesment.eu.auth0.com/api/v2/',
  scope: 'openid profile'}),
  function(req, res) {
    res.redirect('/');
  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/failure'
  }),
  function(req, res) {
    res.redirect('/')
  }
);

app.get('/profile', function(req, res, next) {
  console.log(req);
  res.render('/', {
    user: req.user

  })
});

app.get('/failure', function(req, res, next) {
  res.render('failure');
})

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

app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
  console.log('----------------------------------- ');
  console.log('');
});
