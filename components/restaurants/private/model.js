const { Schema } = require('mongoose');

const RestaurantsSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'rest_image.jpg',
  },
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
