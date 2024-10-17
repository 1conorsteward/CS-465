const express = require('express');
const router = express.Router();
const authController = require('../app_api/controllers/authentication');
const tripsController = require('../app_api/controllers/trips');
const { expressjwt: jwt } = require('express-jwt');


// JWT authentication middleware
const auth = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],  // Replace with the algorithm you're using
  userProperty: 'payload' // Stores the decoded JWT payload in req.payload
});

router
    .route('/login')
    .post(authController.login); // POST: Handle user login

router
    .route('/register')
    .post(authController.register); // POST: Handle user registration

// Trip routes
router
  .route('/trips')
  .get(tripsController.tripsList)   // GET: list all trips
  .post(auth, tripsController.tripsAddTrip); // POST: add new trip

router
  .route('/trips/:tripCode')
  .get(tripsController.tripsFindByCode) // GET: find trip by tripCode
  .put(auth, tripsController.tripsUpdateTrip); // PUT: update trip

module.exports = router;
