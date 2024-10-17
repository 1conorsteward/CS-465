const express = require('express');
const router = express.Router();

// Define routes for the frontend views
router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

router.get('/about', (req, res) => {
  res.render('about', { title: 'About Us' });
});

module.exports = router;
