const mongoose = require('mongoose');

const { Schema } = mongoose;

const ReservationSchema = new Schema({
  tableId: {
    type: mongoose.ObjectId,
    ref: 'Tables',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
    email: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  occasions: {
    type: String,
    enum: ['birthday', 'anniversary', 'date-night', 'business-meal', 'celebration', null],
  },
  message: {
    type: String,
  },
  guestsCount: {
    type: Number,
    default: 1,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
});

module.exports = ReservationSchema;
