const express = require('express');
const router = express.Router();
const { getTrips, getTripsByType, createTrip, updateTrip, deleteTrip, searchTrips } = require('../../../controllers/tripController');
const { ensureLoggedIn, validateTripData } = require('../../../middleware/tripMiddleware');

router.get('/', getTrips);
router.get('/:type', getTripsByType);
router.post('/', ensureLoggedIn, validateTripData, createTrip);
router.put('/:id', ensureLoggedIn, validateTripData, updateTrip);
router.delete('/:id', ensureLoggedIn, deleteTrip);
router.get('/search', searchTrips);

module.exports = router;