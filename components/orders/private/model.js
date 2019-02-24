const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrdersSchema = new Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'Users',
  },
  products: [{
    productId: {
      type: mongoose.ObjectId,
      ref: 'Products',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
  }],
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['visa', 'cash'],
    },
    transactionId: {
      type: String,
    },
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  shipping: {
    address: {
      type: String,
      required: true,
    },
  },
});

module.exports = OrdersSchema;
