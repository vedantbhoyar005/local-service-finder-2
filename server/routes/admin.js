const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @route   GET /api/admin/stats
// @desc    Get admin dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const totalWorkers = await User.countDocuments({ role: 'worker' });
    const activeWorkers = await User.countDocuments({ role: 'worker', status: 'active' });
    const totalBookings = await Booking.countDocuments();
    const completedBookings = await Booking.find({ status: 'completed' });
    
    const totalRevenue = completedBookings.reduce((acc, booking) => {
      // Remove any non-numeric characters like ₹ if they exist
      const amount = parseFloat(booking.totalAmount.replace(/[^0-9.]/g, '')) || 0;
      return acc + amount;
    }, 0);

    const pendingWorkers = await User.find({ role: 'worker', status: 'pending' })
      .select('-password')
      .limit(5);

    res.json({
      stats: [
        { label: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, positive: true },
        { label: "Active Workers", value: activeWorkers.toString(), positive: true },
        { label: "Total Bookings", value: totalBookings.toString(), positive: false },
      ],
      pendingWorkers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

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

// @route   GET /api/admin/services
// @desc    Get all service categories
router.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   POST /api/admin/services
// @desc    Add a new service category
router.post('/services', async (req, res) => {
  try {
    const { id, name, icon, color, basePrice } = req.body;
    const newService = new Service({ id, name, icon, color, basePrice });
    await newService.save();
    res.json(newService);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/admin/services/:id
// @desc    Update a service category
router.put('/services/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   DELETE /api/admin/services/:id
// @desc    Delete a service category
router.delete('/services/:id', async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
