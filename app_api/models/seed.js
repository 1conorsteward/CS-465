// Bring in the DB connection and the Trip schema
const mongoose = require('./db');
const Trip = require('./travlr');

// Read seed data from JSON file
const fs = require('fs');
const trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

// Function to seed the database with trips
const seedTrips = async () => {
    try {
        // Remove existing trips before seeding
        await Trip.deleteMany(); 
        // Insert trips from JSON file
        await Trip.insertMany(trips);
        console.log('Trips data successfully seeded');
    } catch (err) {
        console.error('Error seeding trips data:', err);
    } finally {
        mongoose.connection.close(); // Close the DB connection after seeding
    }
};

// Run the seed function
seedTrips();

