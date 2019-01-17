const Language = require('../models/language.model');

exports.language_create = function (req, res) {
    let language = new Language(
        {
            name: req.body.name,
            title: req.body.title,
            introduction: req.body.introduction
        }
    );

    language.save(function (err) {
        if (err) {
            return (err);
        }
        res.send('Language Created successfully')
    })
};

exports.language_all = function (req, res) {
    Language.find(function (err, language) {
        if (err) return (err);
        res.send(language);
    })
};

exports.language_details = function (req, res) {
    Language.findById(req.params.id, function (err, language) {
        if (err) return (err);
        res.send(language);
    })
};

exports.language_update = function (req, res) {
    Language.findByIdAndUpdate(req.params.id, {$set: req.body}, function (err, language) {
        if (err) return (err);
        res.send('Language udpated.');
    });
};

exports.language_delete = function (req, res) {
    Language.findByIdAndRemove(req.params.id, function (err) {
        if (err) return (err);
        res.send('Deleted language successfully!');
    })
};
