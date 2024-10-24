const Reservation = require('../models/reservationsModel');
const Trip = require('../models/tripModel');

// Get all available trips
exports.getAvailableTrips = async (req, res) => {
  try {
    const trips = await Trip.find({});  // Fetch all trips
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching available trips:', error);
    res.status(500).json({ error: 'Failed to fetch available trips.' });
  }
};

// Get all reservations for the logged-in user
exports.getReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ userId: req.session.userId });
    res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    res.status(500).json({ error: 'Failed to fetch reservations.' });
  }
};

// Create a new reservation for a trip
exports.createReservation = async (req, res) => {
  const { tripId } = req.body;

  try {
    // Find the trip the user wants to reserve
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found.' });
    }

    // Create a new reservation for the logged-in user
    const newReservation = new Reservation({
      userId: req.session.userId,
      tripId: trip._id, 
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      status: 'Pending'
    });

    await newReservation.save();
    res.status(201).json(newReservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    res.status(500).json({ error: 'Failed to create reservation.' });
  }
};

// Delete an existing reservation
exports.deleteReservation = async (req, res) => {
  const reservationId = req.params.id;

  try {
    const deletedReservation = await Reservation.findOneAndDelete({ _id: reservationId, userId: req.session.userId });
    if (!deletedReservation) {
      return res.status(404).json({ error: 'Reservation not found or does not belong to you.' });
    }
    res.status(200).json({ message: 'Reservation deleted successfully.' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    res.status(500).json({ error: 'Failed to delete reservation.' });
  }
};
