const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true // Store the name of the lucide-react icon
  },
  color: {
    type: String,
    required: true // HSL color string
  },
  basePrice: {
    type: Number,
    default: 300
  }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
