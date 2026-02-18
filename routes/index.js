const express = require('express');
const router = express.Router();

router.use('/', require('./swagger'));
router.use('/menu', require('./menu'));
router.use('/restaurants', require('./restaurant'));

module.exports = router;