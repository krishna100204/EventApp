import express from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import Event from '../models/Event.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', async (req, res) => {
  try {
    const { category, startDate, endDate } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const events = await Event.find(query)
      .populate('creator', 'username')
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, description, date, location, category } = req.body;
    let imageUrl = '';

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      imageUrl = result.secure_url;
    }

    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      imageUrl,
      creator: req.user.userId,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

router.post('/:eventId/attend', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    if (!event.attendees.includes(req.user.userId)) {
      event.attendees.push(req.user.userId);
      await event.save();
      req.app.get('io').to(req.params.eventId).emit('attendeeUpdate', {
        eventId: req.params.eventId,
        attendeeCount: event.attendees.length
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating attendance', error: error.message });
  }
});

export default router;