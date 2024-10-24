const express = require('express');
const router = express.Router();
const { 
    getReservations, 
    createReservation, 
    deleteReservation, 
    getAvailableTrips 
} = require('../../../controllers/resController');
const { ensureLoggedIn } = require('../../../middleware/resMiddleware');

// Ensure users are logged in for reservation routes
router.get('/available-trips', ensureLoggedIn, getAvailableTrips); // Fetch all available trips
router.get('/', ensureLoggedIn, getReservations); // Fetch reservations for a user
router.post('/', ensureLoggedIn, createReservation); // Create a new reservation
router.delete('/:id', ensureLoggedIn, deleteReservation); // Delete a reservation

module.exports = router;
