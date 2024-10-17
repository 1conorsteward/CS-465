const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');
const User = mongoose.model('users'); // Assuming you have a user model

// Function to get the user details
const getUser = (req, res, callback) => {
  if (req.payload && req.payload.email) {
    User
      .findOne({ email: req.payload.email })
      .exec((err, user) => {
        if (!user) {
          return res.status(404).json({
            message: 'User not found'
          });
        } else if (err) {
          console.error(err);
          return res.status(404).json(err);
        }
        callback(req, res, user);
      });
  } else {
    return res.status(400).json({
      message: 'User is not authenticated'
    });
  }
};

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
  const q = await Model.find({}).exec();
  
  if (!q) {
    return res.status(404).json({ error: 'No trips found' });
  } else {
    return res.status(200).json(q);
  }
};

// GET: /trips/:tripCode - finds a single trip by tripCode
const tripsFindByCode = async (req, res) => {
  const q = await Model.find({ 'code': req.params.tripCode }).exec();
  
  if (!q) {
    return res.status(404).json({ error: 'No trip found with this code' });
  } else {
    return res.status(200).json(q);
  }
};

// POST: /trips - Adds a new trip
const tripsAddTrip = async (req, res) => {
  getUser(req, res, (req, res) => {
    Trip.create(
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      (err, trip) => {
        if (err) {
          return res
            .status(400) // bad request
            .json(err);
        } else {
          return res
            .status(201) // created
            .json(trip);
        }
      }
    );
  });
};


// PUT: /trips/:tripCode - Updates a trip
const tripsUpdateTrip = async (req, res) => {
  getUser(req, res, (req, res) => {
    Trip.findOneAndUpdate(
      { 'code': req.params.tripCode },
      {
        code: req.body.code,
        name: req.body.name,
        length: req.body.length,
        start: req.body.start,
        resort: req.body.resort,
        perPerson: req.body.perPerson,
        image: req.body.image,
        description: req.body.description
      },
      { new: true }
    )
      .then(trip => {
        if (!trip) {
          return res.status(404).send({
            message: "Trip not found with code " + req.params.tripCode
          });
        }
        res.send(trip);
      })
      .catch(err => {
        if (err.kind === 'ObjectId') {
          return res.status(404).send({
            message: "Trip not found with code " + req.params.tripCode
          });
        }
        return res.status(500).json(err); // server error
      });
  });
};


// Export the functions
module.exports = {
  tripsList,
  tripsFindByCode,
  tripsAddTrip,
  tripsUpdateTrip
};
