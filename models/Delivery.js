const mongoose = require('mongoose');
const deliverySchema = require('./schemas/delivery.schema');

module.exports = mongoose.model('Delivery', deliverySchema);