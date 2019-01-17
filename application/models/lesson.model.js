const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let LessonSchema = new Schema({
    name: {type: String, required: true, max: 100},
    language: {type: String, required: true, max: 100},
    description : {type: String, required: true, max: 200},
    details : {type: String, required: true, max: 200},
});

// Export the model
module.exports = mongoose.model('Lesson', LessonSchema);
