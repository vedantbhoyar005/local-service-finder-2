const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { protect } = require('../middleware/authMiddleware');

const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '30d' });
};

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post('/signup', async (req, res) => {
  const { name, email, password, role, service, experience, city } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      service,
      experience,
      city: city || 'Delhi',
      status: 'active'
    });

    res.status(201).json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/auth/login
// @desc    Auth user & get token
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      // Validate role if one was provided in the UI constraints
      if (role && user.role !== role) {
        return res.status(401).json({ message: `Access denied. Registered as a ${user.role}, not ${role}.` });
      }
      

      res.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/auth/me
// @desc    Get user profile/verify token
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      service: user.service,
      experience: user.experience,
      skills: user.skills,
      city: user.city,
      bio: user.bio,
      hourlyRate: user.hourlyRate,
      availability: user.availability,
      phone: user.phone,
      avatar: user.avatar
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.service = req.body.service || user.service;
      user.experience = req.body.experience || user.experience;
      user.skills = req.body.skills || user.skills;
      user.city = req.body.city || user.city;
      if (req.body.bio !== undefined) user.bio = req.body.bio;
      if (req.body.hourlyRate !== undefined) user.hourlyRate = req.body.hourlyRate;
      if (req.body.availability !== undefined) user.availability = req.body.availability;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        service: updatedUser.service,
        experience: updatedUser.experience,
        skills: updatedUser.skills,
        city: updatedUser.city,
        bio: updatedUser.bio,
        hourlyRate: updatedUser.hourlyRate,
        availability: updatedUser.availability,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
