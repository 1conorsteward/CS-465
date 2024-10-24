const Trip = require('../models/tripModel');
const uuid = require('uuid');

// Fetch all trips
exports.getTripsData = async (req, res) => {
  try {
    const trips = await Trip.find({});
    
    // Send the trips as JSON in response to the client
    return res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching available trips:', error);
    
    // Return an error response if fetching trips fails
    return res.status(500).json({ error: 'Failed to fetch trips' });
  }
};


// Get trips by type (beach, cruise, mountain)
exports.getTripsByType = async (req, res) => {
  const { type } = req.params;
  
  try {
    const trips = await Trip.find({ type });
    res.json(trips);  // Respond with the list of trips
  } catch (error) {
    console.error('Error fetching trips by type:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

// Get all trips for the API
exports.getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});
    res.json(trips);  // Send the trips as JSON for API requests
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
};

// Create a new trip
exports.createTrip = async (req, res) => {
  try {
    const newTrip = new Trip({
      ...req.body,
      id: uuid.v4(),  // Generate a new unique ID
    });
    await newTrip.save();
    res.json(newTrip);
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ error: 'Failed to create trip' });
  }
};

// Update a trip
exports.updateTrip = async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(updatedTrip);
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ error: 'Failed to update trip' });
  }
};

// Delete a trip
exports.deleteTrip = async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.id);
    if (!deletedTrip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ error: 'Failed to delete trip' });
  }
};

// Search trips by destination
exports.searchTrips = async (req, res) => {
  const { destination } = req.query;
  try {
      const trips = await Trip.find({ destination: new RegExp(destination, 'i') });  // Case-insensitive search
      res.json(trips);
  } catch (error) {
      console.error('Error searching trips:', error);
      res.status(500).json({ error: 'Failed to search trips' });
  }
};
