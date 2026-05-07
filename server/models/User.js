const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'worker', 'admin'],
    default: 'user',
  },
  avatar: {
    type: String,
  },
  phone: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'active',
  },
  service: {
    type: String,
  },
  experience: {
    type: String,
  },
  skills: {
    type: [String],
    default: [],
  },
  city: {
    type: String,
    default: 'Delhi',
  },
  bio: {
    type: String,
  },
  hourlyRate: {
    type: Number,
  },
  availability: {
    type: [String],
    default: [],
  },
  rating: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

// Method to compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
