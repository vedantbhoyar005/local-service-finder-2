const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', protect, async (req, res) => {
  const { workerId, bookingId, rating, comment } = req.body;

  try {
    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);
    if (!booking || booking.user.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Invalid booking' });
    }

    const review = await Review.create({
      user: req.user._id,
      worker: workerId,
      booking: bookingId,
      rating,
      comment
    });

    // Update worker's average rating
    const allReviews = await Review.find({ worker: workerId });
    const totalRating = allReviews.reduce((sum, item) => sum + item.rating, 0);
    const avgRating = Math.round((totalRating / allReviews.length) * 10) / 10;
    
    await User.findByIdAndUpdate(workerId, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

// @route   GET /api/reviews/worker/:workerId
// @desc    Get reviews for a worker
// @access  Public
router.get('/worker/:workerId', async (req, res) => {
  try {
    const reviews = await Review.find({ worker: req.params.workerId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

module.exports = router;
