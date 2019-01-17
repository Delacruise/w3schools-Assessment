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
        res.send('Example Created successfully')
    })
};

exports.example_all = function (req, res) {
    Example.find(function (err, example) {
        if (err) return (err);
        res.send(example);
    })
};

exports.example_details = function (req, res) {
    Example.findById(req.params.id, function (err, example) {
        if (err) return (err);
        res.send(example);
    })
};

exports.example_update = function (req, res) {
    Example.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, example) {
        if (err) return (err);
        res.send('Example udpated.');
    });
};

exports.example_delete = function (req, res) {
    Example.findByIdAndRemove(req.params.id, function (err) {
        if (err) return (err);
        res.send('Deleted example successfully!');
    })
};
