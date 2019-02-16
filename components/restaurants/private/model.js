const mongoose = require('mongoose');

const { Schema } = mongoose;

const RestaurantsSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['restaurant', 'cafe'],
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'rest_image.jpg',
  },
  products: [
    {
      type: mongoose.ObjectId,
      ref: 'Products',
    },
  ],
  address: {
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
  },
  tel: {
    type: String,
    required: true,
  },
});

module.exports = RestaurantsSchema;
