const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
  status: { type: String, default: 'Pending' }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
