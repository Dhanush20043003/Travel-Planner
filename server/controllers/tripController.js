// server/controllers/tripController.js
const Trip = require('../models/Trip');

function getUserId(req) {
  if (!req.user) return null;
  return req.user._id || req.user.id || req.user;
}

exports.getTrips = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });
    const trips = await Trip.find({ userId }).sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createTrip = async (req, res) => {
  try {
    const userId = getUserId(req);
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const {
      title, destination, description, imageUrl,
      startDate, endDate, travelers, budget,
      about, highlights, inclusions, exclusions, plan, thingsToCarry
    } = req.body;

    const trip = await Trip.create({
      userId,
      title,
      destination,
      description: description || '',
      imageUrl: imageUrl || '',
      startDate: startDate || '',
      endDate: endDate || '',
      travelers: travelers || 1,
      budget: budget || 0,
      itinerary: [],
      expenses: [],
      checklist: [],
      about: about || '',
      highlights: highlights || [],
      inclusions: inclusions || [],
      exclusions: exclusions || [],
      plan: plan || '',
      thingsToCarry: thingsToCarry || []
    });

    res.status(201).json(trip);
  } catch (err) {
    console.error('createTrip error', err);
    res.status(500).json({ message: err.message || 'Failed to create trip' });
  }
};

exports.getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const userId = getUserId(req);
    if (trip.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // allowed fields to update
    const allowed = [
      'title','destination','description','imageUrl',
      'startDate','endDate','travelers','budget',
      'itinerary','expenses','checklist',
      'about','highlights','inclusions','exclusions','plan','thingsToCarry'
    ];

    allowed.forEach(field => {
      if (req.body[field] !== undefined) {
        trip[field] = req.body[field];
      }
    });

    await trip.save();
    res.json(trip);
  } catch (err) {
    console.error('updateTrip error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const userId = getUserId(req);
    if (trip.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
