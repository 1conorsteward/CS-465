const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  lengthOfStay: {
    nights: { type: Number },
    days: { type: Number }
  },
  startDate: { type: Date, required: true },
  resort: { type: String, required: true },
  pricePerPerson: { type: Number, required: true },
  type: {  // New field to categorize trips
    type: String,
    enum: ['beach', 'cruise', 'mountain'],
    required: true
  },
  image: { type: String } 
});

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;