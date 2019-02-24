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
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  occasions: {
    type: String,
    enum: ['birthday', 'anniversary', 'date-night', 'business-meal', 'celebration'],
  },
  message: {
    type: String,
  },
  guestsCount: {
    type: Number,
    default: 1,
  },
  date: {
    type: String,
    required: true,
  },
  startTime: {
    hour: {
      type: Number,
      required: true,
    },
    minute: {
      type: Number,
      required: true,
    },
  },
  endTime: {
    hour: {
      type: Number,
      required: true,
    },
    minute: {
      type: Number,
      required: true,
    },
  },
});

module.exports = ReservationSchema;
