const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const hbs = require('express-handlebars');
const path = require('path');
const jwt = require('jsonwebtoken');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const xhr = new XMLHttpRequest();

const config = require('../config');
const User = require('./models/user');
const lesson = require('./routes/lesson.route'); // Imports routes for the lesson
const example = require('./routes/example.route'); // Imports routes for the example
const language = require('./routes/language.route'); // Imports routes for the language

let languagesDD = [];

const app = express();

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//** ROUTING **//
app.get('/', function(req, res) {
  if (req.accepts('html')) {
    res.render('index', {
      url: req.url,
      title: "w3school Assessment"
    });
    return;
  }
});
app.get('/lesson', function(req, res) {
  if (req.accepts('html')) {
    res.render('index', {
      url: req.url,
      title: "w3school Assessment"
    });
    return;
  }
});
app.get('/newlanguage', function(req, res) {
  res.render('newlanguage');
});
app.get('/viewlanguage', function(req, res) {
  getLanguage();
  res.render('viewlanguage', {
    url: req.url,
    title: "Languages",
    languagesDD: languagesDD
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
  //getLanguage();
  res.render('newlesson', {
    url: req.url,
    title: "Lessons",
    languagesDD: languagesDD
  });
});
app.get('/viewlesson', function(req, res) {
  getLessons();
  res.render('viewlesson', {
    url: req.url,
    title: "Lessons",
    lessons: lessons
  });
});
app.get('/updatelesson', function(req, res) {
  //getIndividualExample();
  res.render('updatelesson', {
    url: req.url,
    title: "Lessons"
  });
});
app.get('/deletelesson', function(req, res) {
  console.log("Inside delete function");
  deleteTheItem();
  res.render('delete', {
    url: req.url,
    title: "Lessons"
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
app.get('/setup', function(req, res) {
  var newUserData = new User({
    name: 'Luke Daffue',
    password: 'password',
    admin: true
  });

  // save the sample user
  newUserData.save(function(err) {
    if (err) throw err;

    console.log('User saved successfully');
    res.json({
      success: true
    });
  });
});



//** GET LANGUAGES **//
function getLanguage() {
  xhr.open('GET', 'http://localhost:81/languages/get');
  xhr.onload = function() {
    if (xhr.status === 200) {
      languagesDD = xhr.responseText;
      languagesDD = JSON.parse(languagesDD);
    } else {
      console.log('Request failed.  Returned status of ' + xhr.status);
    }
  };
  xhr.send();
}
//** GET LESSONS **//
let lessons = [];

function getLessons() {
  xhr.open('GET', 'http://localhost:81/lessons/get');
  xhr.onload = function() {
    if (xhr.status === 200) {
      lessons = xhr.responseText;
      lessons = JSON.parse(lessons);
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

function deleteTheItem() {
  let goneItemId = document.getElementById("deleteItem").getAttribute('data-idDelete');
  xhr.open('DELETE', 'http://localhost:81/lessons/' + goneItemId + '/delete');
  xhr.onload = function() {
    if (xhr.status === 200) {
      lessons = xhr.responseText;
      lessons = JSON.parse(lessons);
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

//** API ROUTING **//
// get an instance of the router for api routes
var apiRoutes = express.Router();

// route to authenticate a user (POST http://localhost:81/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {
  // find the user
  console.log("************");
  console.log(req.body);
  User.findOne({
    name: req.body.name
  }, function(err, user) {

    if (err) throw err;
      console.log("WE HAVE AN ERROR");
    if (!user) {
      res.json({ success: false, message: 'Authentication failed. User not found.' });
      console.log('Authentication failed. User not found.');
    } else if (user) {

      // check if password matches
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        console.log('Authentication failed. Wrong password.');
      } else {

        // if user is found and password is right
        // create a token with only our given payload
    // we don't want to pass in the entire user since that has the password
    const payload = {
      admin: user.admin     };
        var token = jwt.sign(payload, app.get('superSecret'), {
          expiresIn : 60*60*24// expires in 24 hours
        });

        // return the information including token as JSON
        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: token
        });
      }
    }

  });
});
//route middleware to verify a token
apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('superSecret'), function(err, decoded) {       if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });       } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;         next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({
        success: false,
        message: 'No token provided.'
    });

  }
});
// route to show a random message (GET http://localhost:81/api/)
apiRoutes.get('/', function(req, res) {
  res.json({ message: 'Testin API route' });
  console.log('inside API get');
});

// route to return all users (GET http://localhost:8080/api/users)
apiRoutes.get('/users', function(req, res) {
  User.find({}, function(err, users) {
    res.json(users);
  });
});
// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);
app.use(function(req, res, next) {
  // respond with html page
  if (req.accepts('html')) {
    res.render('404', {
      url: req.url,
      title: "404"
    });
    return;
  }
  // respond with json
  if (req.accepts('json')) {
    res.send({
      error: 'Not found'
    });
    return;
  }
  // default to plain-text. send()
  res.type('txt').send('Not found');
});

app.use(morgan('dev'));

//** BASIC ROUTING **//
app.listen(port, () => {
  console.log('Server is up and running on port number ' + port);
  console.log('----------------------------------- ');
  console.log('');
});
