const express = require('express');
const router = express.Router();

const menuController = require('../controllers/menuController');
router.get('/', menuController.getAll);
router.get('/:id', menuController.getSingle);

router.post('/', menuController.create);
router.put('/:id', menuController.update);
router.delete('/:id', menuController.delete);



module.exports = router;