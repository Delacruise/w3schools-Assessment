const Example = require('../models/example.model');

exports.example_create = function (req, res) {
    let example = new Example(
        {
            name: req.body.name,
            language: req.body.language,
            code: req.body.code
        }
    );

    example.save(function (err) {
        if (err) {
            return (err);
        }
        res.redirect('/viewexample');
    })
};

exports.example_all = function (req, res, next) {
    Example.find(function (err, example) {
        if (err) return next(err);
        res.send(example);
    })
};

exports.example_details = function (req, res, next) {
    Example.findById(req.params.id, function (err, example) {
        if (err) return next(err);
        res.send(example);
    })
};

exports.example_update = function (req, res, next) {
    console.log("req.params.id: " + req.params.id);
    console.log("req.body : " + req.body);
    console.log("inside update xample");
    Example.findByIdAndUpdate(req.params.id, {$set: req.body},
      function (err, example) {
        if (err) return next(err);
        res.send('Example udpated.');
    });
};

exports.example_delete = function (req, res, next) {
    Example.findByIdAndRemove(req.params.id, function (err) {
        if (err) return next(err);
        res.send('Deleted example successfully!');
    })
};
