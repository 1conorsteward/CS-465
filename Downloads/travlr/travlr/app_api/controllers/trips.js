const mongoose = require('mongoose');
const Trip = require('../models/travlr'); // Register model
const Model = mongoose.model('trips');

// GET: /trips - lists all the trips
const tripsList = async (req, res) => {
    const q = await Model
      .find({})  // Return all records
      .exec();

    if(!q) {
      // Database returned no data
      return res
        .status(404)
        .json({ error: 'No trips found' });
    } else { 
      // Return resulting trip list
      return res
        .status(200)
        .json(q);
    }
};

// GET: /trips/:tripCode - finds a single trip by tripCode
const tripsFindByCode = async (req, res) => {
    const q = await Model
      .find({ 'code': req.params.tripCode }) // Return single record
      .exec();
  
    if(!q) {
      // Database returned no data
      return res
        .status(404)
        .json({ error: 'No trip found with this code' });
    } else { 
      // Return resulting trip list
      return res
        .status(200)
        .json(q);
    }
};
  
// Export the functions
module.exports = {
  tripsList,
  tripsFindByCode
};
