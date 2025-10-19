const express = require('express');
const controller = require('../controllers/invoice.controller')
const router = express.Router();

router.get('/',controller.generate)
router.post('/',controller.generate)
router.get('/empty',controller.generateEmpty)

module.exports = router;