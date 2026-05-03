const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   GET /api/admin/workers
// @desc    Get all workers (pending, active, suspended)
router.get('/workers', async (req, res) => {
  try {
    const workers = await User.find({ role: 'worker' }).select('-password');
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/workers/:id/status
// @desc    Update worker status
router.put('/workers/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    const worker = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'worker' },
      { status },
      { new: true }
    ).select('-password');

    if (!worker) {
      return res.status(404).json({ message: 'Worker not found' });
    }

    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
