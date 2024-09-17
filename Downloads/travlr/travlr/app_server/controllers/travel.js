const fs = require('fs');
const path = require('path');

// Correctly read the JSON file with a proper relative path
const tripsFilePath = path.join(__dirname, '../../data/trips.json');
const trips = JSON.parse(fs.readFileSync(tripsFilePath, 'utf8'));

/* GET travel view */
const travel = (req, res) => {
  res.render('travel', { 
    title: 'Travlr Getaways',
    trips: trips // Pass the trips data to the template
  });
};

module.exports = {
  travel
};
