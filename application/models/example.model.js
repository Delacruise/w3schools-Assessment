const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let ExampleSchema = new Schema({
    name: {type: String, required: true, max: 100},
    language: {type: String, required: true, max: 100},
    code: {type: String, required: true},

});

// Export the model
module.exports = mongoose.model('Example', ExampleSchema);
