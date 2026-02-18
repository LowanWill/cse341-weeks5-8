const mongodb = require('../db/connect');
const ObjectId = require('mongodb').ObjectId;

const getAll = (req, res, next) => {
  mongodb.getDb().collection('restaurants').find().toArray().then((lists) => {
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
    .collection('restaurants')
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

const createRestaurant = async (req, res) => {
    try {
        console.log('Received body:', req.body);
        
        if (!req.body || !req.body.name) {
            return res.status(400).json({ message: 'Request body is missing or invalid', body: req.body });
        }
        
        const menu = {
            name: req.body.name,
            location: req.body.location,
            cuisine: req.body.cuisine,
            service: req.body.service,
            rating: req.body.rating,
            familyFriendly: req.body.familyFriendly
        };
        
        const response = await mongodb.getDb().collection('restaurants').insertOne(menu);
        console.log('Insert response:', response);
        
        if (response.acknowledged) {
            res.status(201).json(response); 
        } else {
            res.status(500).json({ message: 'Some error occurred while creating the restaurant.', response });
        }
    } catch (err) {
        console.error('Create restaurant error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

const updateRestaurant = async (req, res) => {
    try {
        console.log('Update body:', req.body);
        
        if (!req.body || !req.body.name) {
            return res.status(400).json({ message: 'Request body is missing or invalid' });
        }
        
        const userId = new ObjectId(req.params.id);
        const restaurant = {
            name: req.body.name,
            location: req.body.location,
            cuisine: req.body.cuisine,
            service: req.body.service,
            rating: req.body.rating,
            familyFriendly: req.body.familyFriendly
        };
        
        const response = await mongodb.getDb().collection('restaurants').replaceOne({ _id: userId }, restaurant);
        console.log('Update response:', response);
        
        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Some error occurred while updating the restaurant.', response });
        }
    } catch (err) {
        console.error('Update restaurant error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

const deleteRestaurant = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDb().collection('restaurants').deleteOne({ _id: userId });
        console.log('Delete response:', response);
        
        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(500).json({ message: 'Some error occurred while deleting the restaurant.', response });
        }
    } catch (err) {
        console.error('Delete restaurant error:', err);
        res.status(500).json({ message: err.message, stack: err.stack, name: err.name });
    }
};

module.exports = {
  getAll,
  getSingle,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
};