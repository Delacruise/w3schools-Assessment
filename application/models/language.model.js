const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LanguageSchema = new Schema({
    name: {type: String, required: true, max: 100},
    title: {type: String, required: true, max: 100},    
    introduction: {type: String, required: true, max: 200},
});

// Export the model
module.exports = mongoose.model('Language', LanguageSchema);
