const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/workers
// @desc    Get all active workers (optional filter by city)
router.get('/', async (req, res) => {
  try {
    const query = { role: 'worker', status: 'active' };
    if (req.query.city) {
      query.city = req.query.city;
    }
    const workers = await User.find(query).select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/workers/:id
// @desc    Get a single worker by ID
router.get('/:id', async (req, res) => {
  try {
    const worker = await User.findById(req.params.id).select('-password');
    if (!worker || worker.role !== 'worker') {
      return res.status(404).json({ message: 'Worker not found' });
    }
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;

