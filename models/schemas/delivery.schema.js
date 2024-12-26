const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  deliveryStatus: {
    type: String,
    enum: ['pending', 'dispatched', 'delivered'],
    default: 'pending'
  },
  deliveryDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

deliverySchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = deliverySchema;