const Lesson = require('../models/lesson.model');
const $ = require('jquery')
const jsdom = require('jsdom');

exports.lesson_create = function (req, res) {
  console.log("inside create");
    let lesson = new Lesson(
        {
            name: req.body.name,
            language: req.body.language,
            description: req.body.description,
            details: req.body.details
        }
    );
    console.log("after create");
    lesson.save(function (err) {
        console.log("before save");
        if (err) {
            console.log("Error: " + err);
            return (err);
        }
        console.log("inside save");
        res.render('lesson');
    })
};


exports.lesson_all = function (req, res) {
    Lesson.find(function (err, lesson) {
        if (err) return (err);
        res.send(lesson);
    })
};

exports.lesson_details = function (req, res) {
    Lesson.findById(req.params.id, function (err, lesson) {
        if (err) return (err);
        res.send(lesson);
    })
};

exports.lesson_update = function (req, res) {
    Lesson.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, lesson) {
        if (err) return (err);
        res.send('Lesson udpated.');
    });
};

exports.lesson_delete = function (req, res) {
    Lesson.findByIdAndRemove(req.params.id, function (err) {
        if (err) return (err);
        res.send('Deleted lesson successfully!');
    })
};

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
