const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const lesson_controller = require('../controllers/lesson.controller');

router.get('/get', lesson_controller.lesson_all);
router.get('/:id', lesson_controller.lesson_details);

router.put('/:id/update', lesson_controller.lesson_update);

router.post('/create', lesson_controller.lesson_create);

router.delete('/:id/delete', lesson_controller.lesson_delete);

module.exports = router;
