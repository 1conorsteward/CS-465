require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
const mongoose = require('mongoose');
const helmet = require('helmet');
const session = require('express-session');
const tripRoutes = require('./routes/api/trips/tripRoutes');
const authRoutes = require('./routes/auth/authRoutes');
const resRoutes = require('./routes/api/reservations/resRoutes');
const tripController = require('./controllers/tripController');
const Trip = require('./models/tripModel');
const adminRoutes = require('./admin/routes/adminRoutes');
const adminTripRoutes = require('./admin/app/routes/adminTripRoutes');
const adminUserRoutes = require('./admin/app/routes/adminUserRoutes');
const adminReservationRoutes = require('./admin/app/routes/adminReservationRoutes');


// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {}).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Error connecting to MongoDB', err);
});

// Security middleware
app.use(helmet());

// Session management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 3600000
  }
}));

// Middleware for static files and JSON parsing
app.use(express.static(path.join(__dirname, 'admin/public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Use the routes in your Express app
app.use('/admin', adminTripRoutes);
app.use('/admin', adminUserRoutes);
app.use('/admin', adminReservationRoutes);

// Set the main views directory
app.set('views', [
  path.join(__dirname, 'views'),              // Normal views directory
  path.join(__dirname, 'admin/views')         // Admin-specific views directory
]);

// View engine setup
app.set('view engine', 'hbs');
// Register global partials
hbs.registerPartials(path.join(__dirname, 'views/partials'));    

// Log the registered partials to debug
console.log(hbs.handlebars.partials);

// Route handling
app.use('/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/reservations', resRoutes);
// Serve Angular Admin Panel
app.use('/admin', express.static(path.join(__dirname, 'admin/client/dist/client')));
 

// Render home page
app.get('/', async (req, res) => {
  try {
    const isLoggedIn = req.session.isLoggedIn || false;
    const trips = await Trip.find({});  // Fetch the trips directly from the database
    res.render('index', { isLoggedIn, trips });  // Pass the trips to the template
  } catch (error) {
    console.error('Error loading homepage:', error);
    res.status(500).send('Error loading homepage');
  }
});

// Render travel page
app.get('/travel', async (req, res) => {
  try {
    const isLoggedIn = req.session.isLoggedIn || false;
    const trips = await Trip.find({});  // Fetch all the trips data
    res.render('travel', { isLoggedIn, trips });  // Pass trips and isLoggedIn to the travel.hbs template
  } catch (error) {
    console.error('Error loading travel page:', error);
    res.status(500).send('Error loading travel page');
  }
});

//Render the news page
app.get('/news', async (req, res) => {
  try {
      const isLoggedIn = req.session.isLoggedIn || false;
      res.render('news', { isLoggedIn });  // Pass isLoggedIn to the news.hbs template
  } catch (error) {
      console.error('Error loading news page:', error);
      res.status(500).send('Error loading news page');
  }
});

// Render the reservations page
app.get('/reservations', async (req, res) => {
  try {
      const isLoggedIn = req.session.isLoggedIn || false;
      const trips = await Trip.find({});
      res.render('reservations', { isLoggedIn });  // Pass the isLoggedIn flag to the reservations.hbs
  } catch (error) {
      console.error('Error loading reservations page:', error);
      res.status(500).send('Error loading reservations page');
  }
});

// Render the checkout page
app.get('/checkout', async (req, res) => {
  try {
      const isLoggedIn = req.session.isLoggedIn || false;
      res.render('checkout', { isLoggedIn });  // Pass the isLoggedIn flag to the checkout.hbs
  } catch (error) {
      console.error('Error loading checkout page:', error);
      res.status(500).send('Error loading checkout page');
  }
});

app.get('/login', (req, res) => { res.redirect('/');});  
app.get('/admin', (req, res) => res.render('admin-travel'));

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});