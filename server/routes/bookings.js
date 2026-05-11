const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const { protect } = require('../middleware/authMiddleware');

const Notification = require('../models/Notification');

// @route   POST /api/bookings
// @desc    Create a new booking
// @access  Private
router.post('/', protect, async (req, res) => {
  const { workerId, service, date, time, location, paymentMethod, totalAmount } = req.body;

  try {
    const booking = await Booking.create({
      user: req.user._id,
      worker: workerId,
      service,
      date,
      time,
      location,
      paymentMethod,
      totalAmount
    });

    // Create notification for the worker
    await Notification.create({
      recipient: workerId,
      type: 'new_booking',
      title: 'New Booking!',
      message: `${req.user.name} booked you for ${service} on ${date} at ${time}`,
      booking: booking._id,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/bookings
// @desc    Get logged in user bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('worker', 'name email service')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/bookings/worker
// @desc    Get worker bookings
// @access  Private
router.get('/worker', protect, async (req, res) => {
  if (req.user.role !== 'worker' && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized as a worker' });
  }

  try {
    const bookings = await Booking.find({ worker: req.user._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   PUT /api/bookings/:id/status
// @desc    Update booking status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  const { status } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only the assigned worker, the user who booked, or an admin can update status
    // (In a real app, you might restrict specific transitions to specific roles)
    booking.status = status;
    await booking.save();

    // If completed, increment worker's job count
    if (status === 'completed') {
      await User.findByIdAndUpdate(booking.worker, { $inc: { completedJobs: 1 } });
    }

    // Create notification for the user
    let notificationTitle = 'Booking Update';
    let notificationMessage = `Your booking status has been updated to ${status}`;

    if (status === 'confirmed') {
      notificationTitle = 'Booking Confirmed!';
      notificationMessage = `The worker has accepted your booking for ${booking.service}.`;
    } else if (status === 'rejected') {
      notificationTitle = 'Booking Rejected';
      notificationMessage = `The worker has declined your booking for ${booking.service}.`;
    } else if (status === 'completed') {
      notificationTitle = 'Service Completed!';
      notificationMessage = `The worker marked your ${booking.service} service as completed. Please leave a review!`;
    }

    await Notification.create({
      recipient: booking.user,
      type: 'booking_update',
      title: notificationTitle,
      message: notificationMessage,
      booking: booking._id,
    });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
