const express = require('express');
const router = express.Router();

// Require the controllers WHICH WE DID NOT CREATE YET!!
const language_controller = require('../controllers/language.controller');

router.get('/get', language_controller.language_all);
router.get('/:id', language_controller.language_details);

router.put('/:id/update', language_controller.language_update);

router.post('/create', language_controller.language_create);

router.delete('/:id/delete', language_controller.language_delete);

module.exports = router;
