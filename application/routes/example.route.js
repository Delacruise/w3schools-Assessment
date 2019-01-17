const express = require('express');
const router = express.Router();

const example_controller = require('../controllers/example.controller');

router.get('/get', example_controller.example_all);
router.get('/:id', example_controller.example_details);

router.put('/:id/update', example_controller.example_update);

router.post('/create', example_controller.example_create);

router.delete('/:id/delete', example_controller.example_delete);



module.exports = router;
