const mongoose = require('mongoose');

const { Schema } = mongoose;

const TableSchema = new Schema({
  restaurantId: {
    type: mongoose.ObjectId,
    ref: 'Restaurants',
    required: true,
    index: true,
  },
  number: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  reservations: [{
    type: mongoose.ObjectId,
    ref: 'Reservation',
    required: true,
  }],
});

TableSchema.index({ 'restaurantId': 1, 'number': 1 }, { unique: true });

module.exports = TableSchema;
