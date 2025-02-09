const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); // Adjust the path as necessary

// Create a new event
router.post('/', async (req, res) => {
  const { eventName, description, dateTime, location, category, image } = req.body;

  try {
    const newEvent = new Event({
      eventName,
      description,
      dateTime,
      location,
      category,
      image,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 