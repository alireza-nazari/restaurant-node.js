const mongoose = require('mongoose');

const { Schema } = mongoose;

const ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    trim: true,
    minLength: 3,
    maxLength: 30,
  },
  description: {
    type: String,
    required: true,
  },
  categories: [{
    type: String,
    required: true,
  }],
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: 'product_img',
  },
});

module.exports = ProductSchema;
