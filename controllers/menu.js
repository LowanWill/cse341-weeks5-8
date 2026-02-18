const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res, next) => {
  mongodb.getDb().collection('menu').find().toArray().then((lists) => {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(lists);
  }).catch((err) => {
    res.status(500).json({ message: err.message });
  });
};

const getSingle = (req, res, next) => {
  const userId = new ObjectId(req.params.id);
  mongodb
    .getDb()
    .collection('menu')
    .find({ _id: userId })
    .toArray()
    .then((lists) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(lists[0]);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

const createMenu = async (req, res) => {
    try {
        console.log('Received body:', req.body);
        
        if (!req.body || !req.body.name) {
            return res.status(400).json({ message: 'Request body is missing or invalid', body: req.body });
        }
        
        const menu = {
            year: req.body.year,
            foodTypes: req.body.foodTypes,
            beverageTypes: req.body.beverageTypes,
            prices: req.body.prices,
            specials: req.body.specials
        };
        
        const response = await mongodb.getDb().collection('menu').insertOne(menu);
        console.log('Insert response:', response);
        
        if (response.acknowledged) {
            res.status(201).json(response); 
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the menu.', response });
        }
    } catch (err) {
        console.error('Create menu error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

const updateMenu = async (req, res) => {
    try {
        console.log('Update body:', req.body);
        
        if (!req.body || !req.body.year) {
            return res.status(400).json({ message: 'Request body is missing or invalid' });
        }
        
        const userId = new ObjectId(req.params.id);
        const menu = {
            year: req.body.year,
            foodTypes: req.body.foodTypes,
            beverageTypes: req.body.beverageTypes,
            prices: req.body.prices,
            specials: req.body.specials
        };
        
        const response = await mongodb.getDb().collection('menu').replaceOne({ _id: userId }, menu);
        console.log('Update response:', response);
        
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Some error occurred while updating the menu.', response });
        }
    } catch (err) {
        console.error('Update menu error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

const deleteMenu = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().collection('menu').deleteOne({ _id: userId });
        console.log('Delete response:', response);
        
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Some error occurred while deleting the menu.', response });
        }
    } catch (err) {
        console.error('Delete menu error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

module.exports = {
  getAll,
  getSingle,
  createMenu,
  updateMenu,
  deleteMenu,
};